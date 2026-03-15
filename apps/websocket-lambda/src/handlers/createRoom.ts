import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { ServerEventType } from 'shared-type-library';
import { generateRoomCode, oneHourFromNow, sendEvent } from '../utilities';
import { APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DB_TABLE_NAME } from '../main';

export const handleEventCreateRoom = async (
  apiClient: ApiGatewayManagementApiClient,
  ddb: DynamoDBDocumentClient,
  connectionId: string
): Promise<APIGatewayProxyResult> => {
  try {
    const roomCode = generateRoomCode();

    // Create room entry in the database
    await ddb.send(
      new PutCommand({
        TableName: DB_TABLE_NAME,
        Item: {
          PK: `ROOM#${roomCode}`,
          SK: 'METADATA',
          hostConnectionId: connectionId,
          createdAt: Date.now(),
          expiresAt: oneHourFromNow,
        },
      })
    );

    // Create connection entry in the database
    await ddb.send(
      new PutCommand({
        TableName: DB_TABLE_NAME,
        Item: {
          PK: `CONNECTION#${connectionId}`,
          SK: 'METADATA',
          roomCode,
          expiresAt: oneHourFromNow,
        },
      })
    );

    // Send the room created event
    await sendEvent(apiClient, connectionId, {
      type: ServerEventType.ROOM_CREATED,
      roomCode,
    });

    return { statusCode: 200, body: '' };
  } catch (err) {
    console.error('Error in createRoom handler:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};

import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { APIGatewayProxyResult } from 'aws-lambda';
import { doesRoomCodeExist } from './helpers/getRoomCode';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { RoomNotFoundError } from '../types/errors';
import { DB_TABLE_NAME } from '../main';
import { sendEvent } from '../utilities';
import { ClientEventJoinRoom, ServerEventType } from 'shared-type-library';

export const handleEventJoinRoom = async (
  apiClient: ApiGatewayManagementApiClient,
  ddb: DynamoDBDocumentClient,
  connectionId: string,
  eventBody: ClientEventJoinRoom
): Promise<APIGatewayProxyResult> => {
  const { roomCode, name } = eventBody;

  if (!(await doesRoomCodeExist(ddb, roomCode))) {
    throw new RoomNotFoundError();
  }

  await ddb.send(
    new PutCommand({
      TableName: DB_TABLE_NAME,
      Item: {
        PK: `ROOM#${roomCode}`,
        SK: `PLAYER#${connectionId}`,
        name,
        joinedAt: Date.now(),
      },
    })
  );

  await ddb.send(
    new PutCommand({
      TableName: DB_TABLE_NAME,
      Item: {
        PK: `CONNECTION#${connectionId}`,
        SK: 'METADATA',
        roomCode,
      },
    })
  );

  await sendEvent(apiClient, connectionId, {
    type: ServerEventType.JOINED_ROOM,
    roomCode,
  });

  return { statusCode: 200, body: '' };
};

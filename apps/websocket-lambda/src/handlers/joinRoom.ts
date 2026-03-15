import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { APIGatewayProxyResult } from 'aws-lambda';
import { doesRoomCodeExist } from './helpers/getRoomCode';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { RoomNotFoundError } from '../errors';
import { DB_TABLE_NAME } from '../main';
import { oneHourFromNow, sendEvent } from '../utilities';
import { ClientEventJoinRoom, ServerEventType } from 'shared-type-library';
import { getHostConnectionId } from './helpers/getHostConnectionId';
import { RoomPlayer } from '../types/databaseTypes';

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
        expiresAt: oneHourFromNow,
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
        expiresAt: oneHourFromNow,
      },
    })
  );

  await sendEvent(apiClient, connectionId, {
    type: ServerEventType.JOINED_ROOM,
    roomCode,
  });

  const roomData = await ddb.send(
    new QueryCommand({
      TableName: DB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :playerPrefix)',
      ExpressionAttributeValues: {
        ':pk': `ROOM#${roomCode}`,
        ':playerPrefix': 'PLAYER#',
      },
    })
  );

  await sendEvent(apiClient, await getHostConnectionId(ddb, connectionId), {
    type: ServerEventType.PLAYER_LIST_UPDATED,
    players: (roomData.Items as RoomPlayer[]).map((player: RoomPlayer) => ({
      name: player.name,
      playerId: player.SK.split("#")[1],
    })),
  });

  return { statusCode: 200, body: '' };
};

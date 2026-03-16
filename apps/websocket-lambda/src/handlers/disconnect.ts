import { DeleteCommand, DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';
import { DB_TABLE_NAME } from '../main';
import { getRoomPlayers } from './helpers/getRoomPlayers';
import { sendEvent } from '../utilities';
import { getHostConnectionId } from './helpers/getHostConnectionId';
import { ServerEventType } from 'shared-type-library';
import { ConnectionMetadata, RoomPlayer } from '../types/databaseTypes';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';

/**
 * General steps
 *
 * 1. Get connection metadata
 * 2. Delete room player entity in db
 * 3. Send player list updated event to room host
 * 4. Delete connection metadata entity in db
 */
export const handleDisconnect = async (
  apiClient: ApiGatewayManagementApiClient,
  ddb: DynamoDBDocumentClient,
  connectionId: string
): Promise<APIGatewayProxyResult> => {
  const connectionMetadata = await ddb.send(
    new GetCommand({
      TableName: DB_TABLE_NAME,
      Key: {
        PK: `CONNECTION#${connectionId}`,
        SK: 'METADATA',
      },
    })
  );

  if (!connectionMetadata.Item) {
    return { statusCode: 200, body: '' };
  }

  const { roomCode, playerId } = connectionMetadata.Item as ConnectionMetadata;

  if (roomCode && playerId) {
    await ddb.send(
      new DeleteCommand({
        TableName: DB_TABLE_NAME,
        Key: {
          PK: `ROOM#${roomCode}`,
          SK: `PLAYER#${playerId}`,
        },
      })
    );

    const roomPlayers = await getRoomPlayers(ddb, roomCode);

    await sendEvent(apiClient, await getHostConnectionId(ddb, connectionId), {
      type: ServerEventType.PLAYER_LIST_UPDATED,
      players: roomPlayers.map((player: RoomPlayer) => ({
        name: player.name,
        playerId: player.SK.split('#')[1],
      })),
    });
  }

  await ddb.send(
    new DeleteCommand({
      TableName: DB_TABLE_NAME,
      Key: {
        PK: `CONNECTION#${connectionId}`,
        SK: 'METADATA',
      },
    })
  );

  return { statusCode: 200, body: '' };
};
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DB_TABLE_NAME } from '../../main';
import { RoomMetadata } from '../../types/databaseTypes';
import { HostConnectionIdNotFoundError } from '../../types/errors';
import { getRoomCode } from './getRoomCode';

export const getHostConnectionId = async (
  ddb: DynamoDBDocumentClient,
  connectionId: string
): Promise<string> => {
  // Get room code for this connection
  const roomCode = await getRoomCode(ddb, connectionId);

  // Get host connectionId for the room
  const roomMetadata = await ddb.send(
    new GetCommand({
      TableName: DB_TABLE_NAME,
      Key: {
        PK: `ROOM#${roomCode}`,
        SK: 'METADATA',
      },
    })
  );

  const hostConnectionId = (roomMetadata.Item as RoomMetadata | undefined)
    ?.hostConnectionId;

  if (!hostConnectionId) {
    throw new HostConnectionIdNotFoundError();
  }

  return hostConnectionId;
};
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DB_TABLE_NAME } from '../../main';
import { ConnectionMetadata } from '../../types/databaseTypes';
import { RoomNotFoundError } from '../../types/errors';

export const doesRoomCodeExist = async (
  ddb: DynamoDBDocumentClient,
  roomCode: string,
): Promise<boolean> => {
  const roomMetadata = await ddb.send(
    new GetCommand({
      TableName: DB_TABLE_NAME,
      Key: {
        PK: `ROOM#${roomCode}`,
        SK: 'METADATA',
      },
    })
  );

  return !!roomMetadata.Item;
}

export const getRoomCode = async (
  ddb: DynamoDBDocumentClient,
  connectionId: string,
): Promise<string> => {
  // Get room code for this connection
  const connectionMetadata = await ddb.send(
    new GetCommand({
      TableName: DB_TABLE_NAME,
      Key: {
        PK: `CONNECTION#${connectionId}`,
        SK: 'METADATA',
      },
    })
  );

  const roomCode = (connectionMetadata.Item as ConnectionMetadata | undefined)
    ?.roomCode;

  if (!roomCode) {
    throw new RoomNotFoundError();
  }

  return roomCode;
};

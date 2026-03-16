import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DB_TABLE_NAME } from '../../main';
import { ConnectionNotFoundError } from '../../errors';
import { ConnectionMetadata } from '../../types/databaseTypes';

export const getConnection = async (
  ddb: DynamoDBDocumentClient,
  connectionId: string
): Promise<ConnectionMetadata> => {
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
    throw new ConnectionNotFoundError();
  }

  return connectionMetadata.Item as ConnectionMetadata;
};
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DB_TABLE_NAME } from "../../main";

export const doesRoomExist = async (
  ddb: DynamoDBDocumentClient,
  roomCode: string,
): Promise<boolean> => {
  const roomMetadata = await ddb.send(
    new GetCommand({
      TableName: DB_TABLE_NAME,
      Key: {
        PK: `ROOM#${roomCode}`,
        SK: "METADATA",
      },
    }),
  );

  return !!roomMetadata.Item;
};

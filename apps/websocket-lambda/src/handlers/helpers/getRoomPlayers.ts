import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DB_TABLE_NAME } from "../../main";
import { RoomPlayer } from "../../types/databaseTypes";

export const getRoomPlayers = async (
  ddb: DynamoDBDocumentClient,
  roomCode: string,
): Promise<RoomPlayer[]> => {
  // Get room players for this room code
  const roomData = await ddb.send(
    new QueryCommand({
      TableName: DB_TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :playerPrefix)",
      ExpressionAttributeValues: {
        ":pk": `ROOM#${roomCode}`,
        ":playerPrefix": "PLAYER#",
      },
    }),
  );

  return (roomData.Items as RoomPlayer[]) || [];
};

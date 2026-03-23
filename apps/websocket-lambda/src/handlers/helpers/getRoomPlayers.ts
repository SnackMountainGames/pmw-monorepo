import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DB_TABLE_NAME } from "../../main";
import { RoomPlayer } from "../../types/databaseTypes";

export const getRoomPlayer = async (
  ddb: DynamoDBDocumentClient,
  roomCode: string,
  playerId: string,
): Promise<RoomPlayer> => {
  // Get room players for this room code
  const roomData = await ddb.send(
    new GetCommand({
      TableName: DB_TABLE_NAME,
      Key: {
        PK: `ROOM#${roomCode}`,
        SK: `PLAYER#${playerId}`,
      },
    }),
  );

  return (roomData.Item as RoomPlayer) || {};
};

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

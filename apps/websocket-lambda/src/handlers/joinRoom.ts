import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyResult } from "aws-lambda";
import { doesRoomExist } from "./helpers/doesRoomExist";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { RoomNotFoundError } from "../errors";
import { DB_TABLE_NAME } from "../main";
import { oneHourFromNow, sendEvent } from "../utilities";
import { ClientEventJoinRoom, ServerEventType } from "shared-type-library";
import { getHostConnectionId } from "./helpers/getHostConnectionId";
import { RoomPlayer } from "../types/databaseTypes";
import { getRoomPlayers } from "./helpers/getRoomPlayers";

/**
 * General steps
 *
 * 1. Validate room code exists
 * 2. Add a room player entity in the db
 * 3. Create connection metadata entity in db (or possibly update connection metadata entity with room code)
 * 4. Send joined room event back to sender
 * 5. Get list of player in the room
 * 6. Send player list updated event to room host
 */
export const handleEventJoinRoom = async (
  apiClient: ApiGatewayManagementApiClient,
  ddb: DynamoDBDocumentClient,
  connectionId: string,
  eventBody: ClientEventJoinRoom,
): Promise<APIGatewayProxyResult> => {
  const { roomCode, name, playerId } = eventBody;

  if (!(await doesRoomExist(ddb, roomCode))) {
    throw new RoomNotFoundError();
  }

  await ddb.send(
    new PutCommand({
      TableName: DB_TABLE_NAME,
      Item: {
        PK: `ROOM#${roomCode}`,
        SK: `PLAYER#${playerId}`,
        name,
        connectionId,
        expiresAt: oneHourFromNow,
      },
    }),
  );

  await ddb.send(
    new PutCommand({
      TableName: DB_TABLE_NAME,
      Item: {
        PK: `CONNECTION#${connectionId}`,
        SK: "METADATA",
        roomCode,
        playerId,
        expiresAt: oneHourFromNow,
      },
    }),
  );

  await sendEvent(apiClient, connectionId, {
    type: ServerEventType.JOINED_ROOM,
    roomCode,
  });

  const roomPlayers = await getRoomPlayers(ddb, roomCode);

  await sendEvent(apiClient, await getHostConnectionId(ddb, connectionId), {
    type: ServerEventType.PLAYER_LIST_UPDATED,
    players: roomPlayers.map((player: RoomPlayer) => ({
      name: player.name,
      playerId: player.SK.split("#")[1],
    })),
  });

  return { statusCode: 200, body: "" };
};

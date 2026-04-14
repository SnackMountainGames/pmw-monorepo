import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import {
  ClientEventSendMessageChangeGameMode,
  ClientEventSendMessageText,
  ClientEventSendMessageType,
  ServerEventChangeGameMode,
  ServerEventClientMessageText,
  ServerEventType,
} from "shared-type-library";
import { sendEvent } from "../utilities";
import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getHostConnectionId } from "./helpers/getHostConnectionId";
import { getConnection } from "./helpers/getConnection";
import { getRoomPlayer, getRoomPlayers } from "./helpers/getRoomPlayers";

export const handleEventSendMessage = async (
  apiClient: ApiGatewayManagementApiClient,
  ddb: DynamoDBDocumentClient,
  connectionId: string,
  eventBody: ClientEventSendMessageText | ClientEventSendMessageChangeGameMode,
): Promise<APIGatewayProxyResult> => {
  const to: string[] = [];

  if (eventBody.to === "host") {
    to.push(await getHostConnectionId(ddb, connectionId));
  } else  if (eventBody.to === "all") {
    const roomCode = (await getConnection(ddb, connectionId)).roomCode;
    const players = await getRoomPlayers(ddb, roomCode);
    to.push(...players.map((player) => player.connectionId));
  } else {
    const roomCode = (await getConnection(ddb, connectionId)).roomCode;
    to.push((await getRoomPlayer(ddb, roomCode, eventBody.to)).connectionId);
  }

  let eventToSend: ServerEventClientMessageText | ServerEventChangeGameMode;

  switch (eventBody.type) {
    case ClientEventSendMessageType.TEXT:
      {
        const from = (await getConnection(ddb, connectionId)).playerId;

        eventToSend = {
          type: ServerEventType.CLIENT_MESSAGE,
          from,
          text: eventBody.text,
        };
        break;
      }
    case ClientEventSendMessageType.CHANGE_GAME_MODE:
      eventToSend = {
        type: ServerEventType.CHANGE_GAME_MODE,
        mode: eventBody.mode,
      };
      break;
  }

  // Send the room created event
  for (const recipient of to) {
    await sendEvent(apiClient, recipient, eventToSend);
  }

  return { statusCode: 200, body: "" };
};

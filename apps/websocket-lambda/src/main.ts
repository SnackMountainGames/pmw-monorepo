import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyResult,
} from "aws-lambda";

import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import {
  ClientEvent,
  ClientEventAction,
  ClientEventSendMessageType,
} from "shared-type-library";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { handleEventHeartbeat } from "./handlers/heartbeat";
import { handleEventCreateRoom } from "./handlers/createRoom";
import { handleEventSendMessage } from "./handlers/sendMessage";
import { HostConnectionIdNotFoundError, RoomNotFoundError } from "./errors";
import { handleEventJoinRoom } from "./handlers/joinRoom";
import { handleDisconnect } from "./handlers/disconnect";
import { handleConnect } from "./handlers/connect";

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);

export const DB_TABLE_NAME = process.env.TABLE_NAME as string;

interface WebSocketEvent {
  body?: string;
  requestContext: APIGatewayEventWebsocketRequestContextV2;
}

export const handler = async (
  event: WebSocketEvent,
): Promise<APIGatewayProxyResult> => {
  console.log("event", event);

  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;

  const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

  const apiClient = new ApiGatewayManagementApiClient({
    endpoint,
  });

  try {
    switch (routeKey) {
      case ClientEventAction.$CONNECT:
        return handleConnect(connectionId);

      case ClientEventAction.$DISCONNECT:
        return handleDisconnect(apiClient, ddb, connectionId);
    }

    const body: ClientEvent = JSON.parse(event.body || "{}");

    switch (body.action) {
      case ClientEventAction.HEARTBEAT:
        return handleEventHeartbeat(apiClient, connectionId);

      case ClientEventAction.SEND_MESSAGE:
        if (body.type === ClientEventSendMessageType.TEXT) {
          return handleEventSendMessage(apiClient, ddb, connectionId, body);
        }
        if (body.type === ClientEventSendMessageType.CHANGE_GAME_MODE) {
          return handleEventSendMessage(apiClient, ddb, connectionId, body);
        }
        if (body.type === ClientEventSendMessageType.RIDER_STATUS) {
          return handleEventSendMessage(apiClient, ddb, connectionId, body);
        }
        return { statusCode: 200, body: "" };

      case ClientEventAction.CREATE_ROOM:
        return handleEventCreateRoom(apiClient, ddb, connectionId);

      case ClientEventAction.JOIN_ROOM:
        return handleEventJoinRoom(apiClient, ddb, connectionId, body);

      default:
        return { statusCode: 200, body: "" };
    }
  } catch (error) {
    if (
      error instanceof RoomNotFoundError ||
      error instanceof HostConnectionIdNotFoundError
    ) {
      return { statusCode: 404, body: "Not found" };
    }
    return { statusCode: 500, body: "Internal error" };
  }
};

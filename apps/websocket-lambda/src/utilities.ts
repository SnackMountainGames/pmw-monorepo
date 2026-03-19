import { ServerEvent } from "shared-type-library";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

export const sendEvent = async (
  apiClient: ApiGatewayManagementApiClient,
  targetConnectionId: string,
  data: ServerEvent,
) => {
  try {
    await apiClient.send(
      new PostToConnectionCommand({
        ConnectionId: targetConnectionId,
        Data: Buffer.from(JSON.stringify(data)),
      }),
    );
  } catch (err) {
    console.error("Send message failed:", err);
  }
};

export const generateRoomCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return Array.from({ length: 4 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

export const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600;

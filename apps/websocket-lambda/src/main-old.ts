console.log("Hello world");
/*
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayEventWebsocketRequestContextV2 } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand
} from "@aws-sdk/client-apigatewaymanagementapi";

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.TABLE_NAME as string;

interface WebSocketEvent {
  body?: string;
  requestContext: APIGatewayEventWebsocketRequestContextV2;
}

interface PlayerItem {
  PK: string;
  SK: string;
  name?: string;
  joinedAt?: number;
}

interface RoomMetadata {
  PK: string;
  SK: "METADATA";
  hostConnectionId: string;
  createdAt?: number;
  expiresAt?: number;
}

interface ConnectionMetadata {
  PK: string;
  SK: "METADATA";
  roomCode: string;
}

interface ActionBody {
  action?: string;
  roomCode?: string;
  name?: string;
  text?: string;
  mimeType?: string;
  data?: string;
}

export const handler = async (
  event: WebSocketEvent
): Promise<APIGatewayProxyResult> => {
  console.log("event", event);

  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;

  const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

  const apiClient = new ApiGatewayManagementApiClient({
    endpoint
  });

  async function sendMessage(targetConnectionId: string, data: unknown) {
    try {
      await apiClient.send(
        new PostToConnectionCommand({
          ConnectionId: targetConnectionId,
          Data: Buffer.from(JSON.stringify(data))
        })
      );
    } catch (err) {
      console.error("Send message failed:", err);
    }
  }

  async function broadcastToRoom(roomCode: string, message: unknown) {
    const result = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `ROOM#${roomCode}`
        }
      })
    );

    const items = result.Items ?? [];

    const players = items.filter(
      (item) => item.SK && item.SK.startsWith("PLAYER#")
    );

    for (const player of players) {
      const playerConnectionId = player.SK.replace("PLAYER#", "");
      await sendMessage(playerConnectionId, message);
    }

    const metadata = items.find((item) => item.SK === "METADATA") as
      | RoomMetadata
      | undefined;

    if (metadata?.hostConnectionId) {
      await sendMessage(metadata.hostConnectionId, message);
    }
  }

  try {
    if (routeKey === "$connect") {
      console.log("Connected:", connectionId);
      return { statusCode: 200, body: "" };
    }

    if (routeKey === "$disconnect") {
      console.log("Disconnected:", connectionId);

      const connectionRecord = await ddb.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `CONNECTION#${connectionId}`,
            SK: "METADATA"
          }
        })
      );

      const roomCode = (connectionRecord.Item as ConnectionMetadata | undefined)
        ?.roomCode;

      if (roomCode) {
        await ddb.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
              PK: `ROOM#${roomCode}`,
              SK: `PLAYER#${connectionId}`
            }
          })
        );

        const roomData = await ddb.send(
          new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk",
            ExpressionAttributeValues: {
              ":pk": `ROOM#${roomCode}`
            }
          })
        );

        const items = roomData.Items ?? [];

        const metadata = items.find(
          (i) => i.SK === "METADATA"
        ) as RoomMetadata | undefined;

        const players = items
          .filter((i) => i.SK.startsWith("PLAYER#"))
          .map((p) => ({
            connectionId: p.SK.replace("PLAYER#", ""),
            name: p.name
          }));

        if (metadata?.hostConnectionId) {
          await sendMessage(metadata.hostConnectionId, {
            type: "playerListUpdated",
            players
          });
        }
      }

      await ddb.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `CONNECTION#${connectionId}`,
            SK: "METADATA"
          }
        })
      );

      return { statusCode: 200, body: "" };
    }

    const body: ActionBody = JSON.parse(event.body || "{}");

    if (body.action === "heartbeat") {
      await sendMessage(connectionId, {
        type: "heartbeat",
        timestamp: Date.now()
      });

      return { statusCode: 200, body: "" };
    }

    if (body.action === "createRoom") {
      const roomCode = generateRoomCode();

      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `ROOM#${roomCode}`,
            SK: "METADATA",
            hostConnectionId: connectionId,
            createdAt: Date.now(),
            expiresAt: Math.floor(Date.now() / 1000) + 60 * 60
          }
        })
      );

      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `CONNECTION#${connectionId}`,
            SK: "METADATA",
            roomCode
          }
        })
      );

      await sendMessage(connectionId, {
        type: "roomCreated",
        roomCode
      });

      return { statusCode: 200, body: "" };
    }

    if (body.action === "joinRoom") {
      const { roomCode, name } = body;

      if (!roomCode) {
        return { statusCode: 400, body: "roomCode required" };
      }

      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `ROOM#${roomCode}`,
            SK: `PLAYER#${connectionId}`,
            name,
            joinedAt: Date.now()
          }
        })
      );

      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `CONNECTION#${connectionId}`,
            SK: "METADATA",
            roomCode
          }
        })
      );

      await sendMessage(connectionId, {
        type: "joinedRoom",
        roomCode
      });

      const roomData = await ddb.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "PK = :pk",
          ExpressionAttributeValues: {
            ":pk": `ROOM#${roomCode}`
          }
        })
      );

      const items = roomData.Items ?? [];

      const metadata = items.find(
        (i) => i.SK === "METADATA"
      ) as RoomMetadata | undefined;

      const players = items
        .filter((i) => i.SK.startsWith("PLAYER#"))
        .map((p) => ({
          connectionId: p.SK.replace("PLAYER#", ""),
          name: p.name
        }));

      if (metadata?.hostConnectionId) {
        await sendMessage(metadata.hostConnectionId, {
          type: "playerListUpdated",
          players
        });
      }

      return { statusCode: 200, body: "" };
    }

    return { statusCode: 200, body: "" };
  } catch (err) {
    console.error("Handler error:", err);
    return { statusCode: 500, body: "Internal error" };
  }
};

// ----------------------------
// Utilities
// ----------------------------

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return Array.from({ length: 4 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}

async function getRoomForConnection(connectionId: string): Promise<string> {
  const result = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `CONNECTION#${connectionId}`,
        SK: "METADATA"
      }
    })
  );

  const item = result.Item as ConnectionMetadata | undefined;

  if (!item) {
    throw new Error("Connection not found");
  }

  return item.roomCode;
}

async function getHostConnection(roomCode: string): Promise<string> {
  const result = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ROOM#${roomCode}`,
        SK: "METADATA"
      }
    })
  );

  const item = result.Item as RoomMetadata | undefined;

  if (!item) {
    throw new Error("Host not found");
  }

  return item.hostConnectionId;
}*/

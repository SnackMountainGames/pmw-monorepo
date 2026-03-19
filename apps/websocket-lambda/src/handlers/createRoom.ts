import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";
import { ServerEventType } from "shared-type-library";
import { generateRoomCode, oneHourFromNow, sendEvent } from "../utilities";
import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DB_TABLE_NAME } from "../main";
import { doesRoomExist } from "./helpers/doesRoomExist";

/**
 * General steps
 *
 * 1. Generate a new room code
 * 2. Validate the generated code is unique
 * 3. Create room metadata entity in db
 * 4. Create connection metadata entity in db (or possibly update connection metadata entity with room code)
 * 5. Send room created event back to sender
 */
export const handleEventCreateRoom = async (
  apiClient: ApiGatewayManagementApiClient,
  ddb: DynamoDBDocumentClient,
  connectionId: string,
): Promise<APIGatewayProxyResult> => {
  let roomCode;

  do {
    roomCode = generateRoomCode();
  } while (await doesRoomExist(ddb, roomCode));

  // Create room entry in the database
  await ddb.send(
    new PutCommand({
      TableName: DB_TABLE_NAME,
      Item: {
        PK: `ROOM#${roomCode}`,
        SK: "METADATA",
        hostConnectionId: connectionId,
        expiresAt: oneHourFromNow,
      },
    }),
  );

  // Create connection entry in the database
  await ddb.send(
    new PutCommand({
      TableName: DB_TABLE_NAME,
      Item: {
        PK: `CONNECTION#${connectionId}`,
        SK: "METADATA",
        roomCode,
        expiresAt: oneHourFromNow,
      },
    }),
  );

  // Send the room created event
  await sendEvent(apiClient, connectionId, {
    type: ServerEventType.ROOM_CREATED,
    roomCode,
  });

  return { statusCode: 200, body: "" };
};

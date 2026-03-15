import {
  APIGatewayEventWebsocketRequestContextV2,
  APIGatewayProxyResult,
} from 'aws-lambda';

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { generateRoomCode } from './utilities';
import {
  ClientEvent,
  ClientEventAction,
  ClientEventSendMessageType,
  ServerEvent,
  ServerEventType,
} from 'shared-type-library';

interface WebSocketEvent {
  body?: string;
  requestContext: APIGatewayEventWebsocketRequestContextV2;
}

export const handler = async (
  event: WebSocketEvent
): Promise<APIGatewayProxyResult> => {
  console.log('event', event);

  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;

  const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

  const apiClient = new ApiGatewayManagementApiClient({
    endpoint,
  });

  async function sendMessage(targetConnectionId: string, data: ServerEvent) {
    try {
      await apiClient.send(
        new PostToConnectionCommand({
          ConnectionId: targetConnectionId,
          Data: Buffer.from(JSON.stringify(data)),
        })
      );
    } catch (err) {
      console.error('Send message failed:', err);
    }
  }

  try {
    if (routeKey === ClientEventAction.$CONNECT) {
      console.log('Connected:', connectionId);
      return { statusCode: 200, body: '' };
    }

    if (routeKey === ClientEventAction.$DISCONNECT) {
      console.log('Disconnected:', connectionId);
      return { statusCode: 200, body: '' };
    }

    const body: ClientEvent = JSON.parse(event.body || '{}');

    switch (body.action) {
      case ClientEventAction.HEARTBEAT:
        await sendMessage(connectionId, {
          type: ServerEventType.HEARTBEAT,
        });
        return { statusCode: 200, body: '' };
      case ClientEventAction.SEND_MESSAGE:
        if (body.type === ClientEventSendMessageType.TEXT) {
          console.log(body.to, body.text);
        }
        if (body.type === ClientEventSendMessageType.TAP) {
          console.log(body.x, body.y);
        }
        return { statusCode: 200, body: '' };
      case ClientEventAction.CREATE_ROOM:
        await sendMessage(connectionId, {
          type: ServerEventType.ROOM_CREATED,
          roomCode: generateRoomCode(),
        });
    }

    return { statusCode: 200, body: '' };
  } catch (err) {
    console.error('Handler error:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};


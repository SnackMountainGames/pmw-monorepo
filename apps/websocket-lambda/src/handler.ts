import { APIGatewayProxyResult } from 'aws-lambda';
import { APIGatewayEventWebsocketRequestContextV2 } from 'aws-lambda';

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { getTs } from './utilities';


interface WebSocketEvent {
  body?: string;
  requestContext: APIGatewayEventWebsocketRequestContextV2;
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
  console.log('event', event);

  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;

  const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

  const apiClient = new ApiGatewayManagementApiClient({
    endpoint,
  });

  async function sendMessage(targetConnectionId: string, data: unknown) {
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
    if (routeKey === '$connect') {
      console.log('Connected:', connectionId);
      return { statusCode: 200, body: '' };
    }

    if (routeKey === '$disconnect') {
      console.log('Disconnected:', connectionId);
      return { statusCode: 200, body: '' };
    }

    const body: ActionBody = JSON.parse(event.body || '{}');

    if (body.action === 'heartbeat') {
      await sendMessage(connectionId, {
        type: `heartbeat ${getTs()}`,
        timestamp: Date.now(),
      });

      return { statusCode: 200, body: '' };
    }

    return { statusCode: 200, body: '' };
  } catch (err) {
    console.error('Handler error:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};

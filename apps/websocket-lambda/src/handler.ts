import { APIGatewayProxyResult } from 'aws-lambda';
import { APIGatewayEventWebsocketRequestContextV2 } from 'aws-lambda';

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { getTs } from './utilities';
import { OutboundMessage } from 'shared-component-library';

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

    const body: OutboundMessage = JSON.parse(event.body || '{}');

    switch (body.action) {
      case 'heartbeat':
        await sendMessage(connectionId, {
          type: `heartbeat ${getTs()}`,
          timestamp: Date.now(),
        });
        return { statusCode: 200, body: '' };
      case 'sendMessage':
        if (body.type === 'text') {
          console.log(body.to, body.text);
        }
        return { statusCode: 200, body: '' };
    }

    return { statusCode: 200, body: '' };
  } catch (err) {
    console.error('Handler error:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};

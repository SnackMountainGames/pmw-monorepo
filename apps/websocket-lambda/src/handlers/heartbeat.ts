import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { ServerEventType } from 'shared-type-library';
import { sendEvent } from '../utilities';
import { APIGatewayProxyResult } from 'aws-lambda';

export const handleEventHeartbeat = async (
  apiClient: ApiGatewayManagementApiClient,
  connectionId: string
): Promise<APIGatewayProxyResult> => {
  // Send the heartbeat event
  await sendEvent(apiClient, connectionId, {
    type: ServerEventType.HEARTBEAT,
  });
  return { statusCode: 200, body: '' };
};
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import {
  ClientEventSendMessageText,
  ServerEventType,
} from 'shared-type-library';
import { sendEvent } from '../utilities';
import { APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getHostConnectionId } from './helpers/getHostConnectionId';

export const handleEventSendMessage = async (
  apiClient: ApiGatewayManagementApiClient,
  ddb: DynamoDBDocumentClient,
  connectionId: string,
  eventBody: ClientEventSendMessageText
): Promise<APIGatewayProxyResult> => {
  let to: string;

  if (eventBody.to === 'host') {
    to = await getHostConnectionId(ddb, connectionId);
  } else {
    to = eventBody.to;
  }

  // Send the room created event
  await sendEvent(apiClient, to, {
    type: ServerEventType.CLIENT_MESSAGE,
    from: connectionId,
    text: eventBody.text,
  });

  return { statusCode: 200, body: '' };
};
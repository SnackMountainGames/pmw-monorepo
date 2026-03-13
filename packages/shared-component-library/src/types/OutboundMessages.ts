/**
 * Outbound messages (Client/Host -> Server)
 */
export enum OutboundMessageAction {
  HEARTBEAT = 'heartbeat',
  SEND_MESSAGE = 'sendMessage',
}

export type OutboundMessageHeartbeat = {
  action: OutboundMessageAction.HEARTBEAT;
};

export enum SendMessageType {
  TEXT = 'text',
  TAP = 'tap'
}

type OutboundMessageSendMessageBase = {
  action: OutboundMessageAction.SEND_MESSAGE;
  to: string | 'host';
};

export type OutboundMessageSendMessageText = OutboundMessageSendMessageBase & {
  type: SendMessageType.TEXT;
  text: string;
};

export type OutboundMessageSendMessageTap = OutboundMessageSendMessageBase & {
  type: SendMessageType.TAP;
  x: number;
  y: number;
};

export type OutboundMessage =
  | OutboundMessageHeartbeat
  | OutboundMessageSendMessageText
  | OutboundMessageSendMessageTap;

/**
 * Client messages (Client/Host -> Server)
 */
export enum ClientMessageAction {
  HEARTBEAT = "heartbeat",
  SEND_MESSAGE = "sendMessage",
}

export interface ClientMessage {
  type: ClientMessageAction;
  roomCode?: string;
  room?: any[];
  players?: Player[];
  text?: string;
  from?: string;
  mimeType?: string;
  data?: string;
}

export interface Player {
  connectionId: string;
  name: string;
}
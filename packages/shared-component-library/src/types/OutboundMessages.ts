/**
 * (Client/Host -> Server)
 */
export type OutboundMessage =
  | OutboundMessageHeartbeat
  | OutboundMessageSendMessageText
  | OutboundMessageSendMessageTap;

export enum OutboundMessageAction {
  HEARTBEAT = 'heartbeat',
  SEND_MESSAGE = 'sendMessage',
}

export type OutboundMessageHeartbeat = {
  action: OutboundMessageAction.HEARTBEAT;
}

export type OutboundMessageSendMessage = {
  action: OutboundMessageAction.SEND_MESSAGE;
  to: string | "host";
};

export enum OutboundMessageSendMessageType {
  TEXT = "text",
  TAP = "click",
}

export type OutboundMessageSendMessageText = {
  type: OutboundMessageSendMessageType.TEXT;
  text: string;
} & OutboundMessageSendMessage;

export type OutboundMessageSendMessageTap = {
  type: OutboundMessageSendMessageType.TAP;
  x: number;
  y: number;
} & OutboundMessageSendMessage;


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
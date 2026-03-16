/**
 * Client events (client/host -> server)
 */
export enum ClientEventAction {
  $CONNECT = '$connect',
  $DISCONNECT = '$disconnect',
  HEARTBEAT = 'heartbeat',
  SEND_MESSAGE = 'sendMessage',
  CREATE_ROOM = 'createRoom',
  JOIN_ROOM = 'joinRoom',
}

/**
 * Heartbeat
 */
export type ClientEventHeartbeat = {
  action: ClientEventAction.HEARTBEAT;
};

/**
 * Send message
 */
export enum ClientEventSendMessageType {
  TEXT = 'text',
  TAP = 'tap',
}

type ClientEventSendMessageBase = {
  action: ClientEventAction.SEND_MESSAGE;
  to: string | 'host';
};

export type ClientEventSendMessageText = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.TEXT;
  text: string;
};

export type ClientEventSendMessageTap = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.TAP;
  x: number;
  y: number;
};

/**
 * Create room
 */
export type ClientEventCreateRoom = {
  action: ClientEventAction.CREATE_ROOM;
};

/**
 * Join room
 */
export type ClientEventJoinRoom = {
  action: ClientEventAction.JOIN_ROOM;
  roomCode: string;
  name: string;
  playerId: string;
}

export type ClientEvent =
  | ClientEventHeartbeat
  | ClientEventSendMessageText
  | ClientEventSendMessageTap
  | ClientEventCreateRoom
  | ClientEventJoinRoom;
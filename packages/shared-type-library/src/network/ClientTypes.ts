import { GameMode } from "./GameTypes.js";

/**
 * Client events (client/host -> server)
 */
export enum ClientEventAction {
  $CONNECT = "$connect",
  $DISCONNECT = "$disconnect",
  HEARTBEAT = "heartbeat",
  SEND_MESSAGE = "sendMessage",
  CREATE_ROOM = "createRoom",
  JOIN_ROOM = "joinRoom",
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
  TEXT = "text",
  TAP = "tap",
  CHANGE_GAME_MODE = "changeGameMode",
  RIDER_STATUS = "riderStatus"
}

type ClientEventSendMessageBase = {
  action: ClientEventAction.SEND_MESSAGE;
  to: string | "host" | "all";
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

export type ClientEventSendMessageChangeGameMode = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.CHANGE_GAME_MODE;
  mode: GameMode;
};

export enum RiderStatus {
  IDLE = "idle",
  ACTIVE = "active"
}

export type ClientEventSendMessageRiderStatus = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.RIDER_STATUS;
  status: RiderStatus;
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
};

export type ClientEvent =
  | ClientEventHeartbeat
  | ClientEventSendMessageText
  | ClientEventSendMessageTap
  | ClientEventSendMessageChangeGameMode
  | ClientEventSendMessageRiderStatus
  | ClientEventCreateRoom
  | ClientEventJoinRoom;

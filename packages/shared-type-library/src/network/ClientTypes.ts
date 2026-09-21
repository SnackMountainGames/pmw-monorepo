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
  COORDINATES = "coordinates",
  CHANGE_GAME_MODE = "changeGameMode",
  RIDER_STATUS = "riderStatus",
  TAP_COUNT = "tapCount",
}

type ClientEventSendMessageBase = {
  action: ClientEventAction.SEND_MESSAGE;
  to: string | "host" | "all";
};

export type ClientEventSendMessageText = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.TEXT;
  text: string;
};

export type ClientEventSendMessageCoordinates = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.COORDINATES;
  x: number;
  y: number; // height
  z: number;
};

export type ClientEventSendMessageChangeGameMode = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.CHANGE_GAME_MODE;
  mode: GameMode;
};

export enum RiderStatus {
  IDLE = "idle",
  ACTIVE = "active",
  SUCCESS = "success",
  FAILURE = "failure",
}

export type ClientEventSendMessageRiderStatus = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.RIDER_STATUS;
  status: RiderStatus;
  time?: number;
};

export type ClientEventSendMessageTapCount = ClientEventSendMessageBase & {
  type: ClientEventSendMessageType.TAP_COUNT;
  tapCount: number;
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
  | ClientEventSendMessageCoordinates
  | ClientEventSendMessageChangeGameMode
  | ClientEventSendMessageRiderStatus
  | ClientEventCreateRoom
  | ClientEventJoinRoom
  | ClientEventSendMessageTapCount;

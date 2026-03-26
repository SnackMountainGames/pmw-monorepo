import { Rider } from "./GameTypes.js";

/**
 * Server messages (server -> client/host)
 */
export enum ServerEventType {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  HEARTBEAT = "heartbeat",
  ROOM_CREATED = "roomCreated",
  JOINED_ROOM = "joinedRoom",
  CLIENT_MESSAGE = "clientMessage",
  PLAYER_LIST_UPDATED = "playerListUpdated",
}

/**
 * Connected
 */
export type ServerEventConnected = {
  type: ServerEventType.CONNECTED;
};

/**
 * Disconnected
 */
export type ServerEventDisconnected = {
  type: ServerEventType.DISCONNECTED;
};

/**
 * Heartbeat
 */
export type ServerEventHeartbeat = {
  type: ServerEventType.HEARTBEAT;
};

/**
 * Room created
 */
export type ServerEventRoomCreated = {
  type: ServerEventType.ROOM_CREATED;
  roomCode: string;
};

/**
 * Joined room
 */
export type ServerEventJoinedRoom = {
  type: ServerEventType.JOINED_ROOM;
  roomCode: string;
};

/**
 * Client message
 */
export type ServerEventClientMessageText = {
  type: ServerEventType.CLIENT_MESSAGE;
  from: string;
  text: string;
};

/**
 * Player list updated
 */
export type ServerEventPlayerListUpdated = {
  type: ServerEventType.PLAYER_LIST_UPDATED;
  players: Rider[];
};

export type ServerEvent =
  | ServerEventConnected
  | ServerEventDisconnected
  | ServerEventHeartbeat
  | ServerEventRoomCreated
  | ServerEventJoinedRoom
  | ServerEventClientMessageText
  | ServerEventPlayerListUpdated;

export type ServerEventListener = (message: ServerEvent) => void;

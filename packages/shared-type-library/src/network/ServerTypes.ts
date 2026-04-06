import { GameMode, Rider } from "./GameTypes.js";

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
  CHANGE_GAME_MODE = "changeGameMode",
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

export type ServerEventChangeGameMode = {
  type: ServerEventType.CHANGE_GAME_MODE;
  mode: GameMode;
}

export type ServerEvent =
  | ServerEventConnected
  | ServerEventDisconnected
  | ServerEventHeartbeat
  | ServerEventRoomCreated
  | ServerEventJoinedRoom
  | ServerEventClientMessageText
  | ServerEventPlayerListUpdated
  | ServerEventChangeGameMode;

export type ServerEventListener = (message: ServerEvent) => void;

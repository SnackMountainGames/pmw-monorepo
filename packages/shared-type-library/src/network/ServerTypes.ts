/**
 * Server messages (server -> client/host)
 */
export enum ServerEventType {
  HEARTBEAT = "heartbeat",
  ROOM_CREATED = "roomCreated",
  JOINED_ROOM = "joinedRoom",
  CLIENT_MESSAGE = "clientMessage"
}

/**
 * Heartbeat
 */
export type ServerEventHeartbeat = {
  type: ServerEventType.HEARTBEAT;
}

/**
 * Room created
 */
export type ServerEventRoomCreated = {
  type: ServerEventType.ROOM_CREATED;
  roomCode: string;
}

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
  text: string;
}

export type ServerEvent =
  | ServerEventHeartbeat
  | ServerEventRoomCreated
  | ServerEventJoinedRoom
  | ServerEventClientMessageText;

export type ServerEventListener = (message: ServerEvent) => void;
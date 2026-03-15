/**
 * Server messages (server -> client/host)
 */
export enum ServerEventType {
  HEARTBEAT = "heartbeat",
  ROOM_CREATED = "roomCreated",
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

export type ServerEvent = ServerEventHeartbeat | ServerEventRoomCreated;

export type ServerEventListener = (message: ServerEvent) => void;
/**
 * Client messages (Client -> Server)
 */
export enum WebSocketMessageActions {
  HEARTBEAT = "heartbeat",
}

export interface WebSocketMessage {
  type: WebSocketMessageActions;
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

/**
 *
 */
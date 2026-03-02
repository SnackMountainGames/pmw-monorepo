/**
 * Client messages (Client -> Server)
 */
export enum ClientMessageAction {
  HEARTBEAT = "heartbeat",
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

/**
 *
 */
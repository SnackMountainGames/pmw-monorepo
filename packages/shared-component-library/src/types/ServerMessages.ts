/**
 * Server messages (Server -> Client)
 */
export enum ServerMessageAction {
  HEARTBEAT = 'heartbeat',
  JOINED_ROOM = 'joinedRoom',
}

export type ServerMessage = {
  type: ServerMessageAction;
  [key: string]: any;
};

export type ServerMessageListener = (message: ServerMessage) => void;

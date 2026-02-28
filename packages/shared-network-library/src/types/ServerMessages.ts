/**
 * Server messages (Server -> Client)
 */
export enum ServerMessageAction {
  HEARTBEAT = 'heartbeat',
}

export type ServerMessage = {
  type: ServerMessageAction;
  [key: string]: any;
};

export type ServerMessageListener = (message: ServerMessage) => void;

/**
 * Server messages (Server -> Client)
 */
export enum ServerMessageAction {
  HEARTBEAT = 'heartbeat',
  JOINED_ROOM = 'joinedRoom',
  ROOM_CREATED = 'roomCreated',
  PLAYER_LIST_UPDATED = 'playerListUpdated',
  PHONE_MESSAGE = 'phoneMessage',
}

export type ServerMessage = {
  type: ServerMessageAction;
  [key: string]: any;
};

export type ServerMessageListener = (message: ServerMessage) => void;

export type ConnectionMetadata = {
  PK: string;
  SK: 'METADATA';
  roomCode: string;
  expiresAt: number;
};

export type RoomMetadata = {
  PK: string;
  SK: 'METADATA';
  hostConnectionId: string;
  createdAt: number;
  expiresAt: number;
}

export type RoomPlayer = {
  PK: string;
  SK: string;
  name: string;
  createdAt: number;
  expiresAt: number;
};

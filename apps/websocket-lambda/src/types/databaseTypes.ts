export type ConnectionMetadata = {
  PK: string;
  SK: "METADATA";
  roomCode: string;
  playerId: string;
  expiresAt: number;
};

export type RoomMetadata = {
  PK: string;
  SK: "METADATA";
  hostConnectionId: string;
  expiresAt: number;
};

export type RoomPlayer = {
  PK: string;
  SK: string;
  name: string;
  connectionId: string;
  expiresAt: number;
};

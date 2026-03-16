export class RoomNotFoundError extends Error {
  constructor() {
    super(`Room code for this user was not found`);
    this.name = 'RoomNotFoundError';
  }
}

export class HostConnectionIdNotFoundError extends Error {
  constructor() {
    super(`The host connection id was not found`);
    this.name = 'HostConnectionIdNotFoundError';
  }
}

export class PlayerNotFoundError extends Error {
  constructor() {
    super(`Player id was not found for this user`);
    this.name = 'PlayerNotFoundError';
  }
}

export class ConnectionNotFoundError extends Error {
  constructor() {
    super(`Connection information was not found for this connection`);
    this.name = 'ConnectionNotFoundError';
  }
}
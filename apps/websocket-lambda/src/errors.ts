export class RoomNotFoundError extends Error {
  constructor() {
    super(`Room code for this user was not found`);
    this.name = 'RoomNotFoundError';
  }
}

export class HostConnectionIdNotFoundError extends Error {
  constructor() {
    super(`The host connection Id was not found`);
    this.name = 'HostConnectionIdNotFoundError';
  }
}

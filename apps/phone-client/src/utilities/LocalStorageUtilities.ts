import { generatePlayerId } from "./generatePlayerId";

export enum LocalStorageKeys {
  PLAYER_ID = "pmw-playerId",
  ROOM_CODE = "pmw-roomCode",
  ROOM_CODE_EXPIRATION = "pmw-roomCode-expiration",
  NAME = "pmw-name",
  AUTO_CONNECT = "pmw-autoConnect",
}

export const getFromLocalStorage = (key: string): string | undefined => {
  const value = localStorage.getItem(key);

  if (!value) return undefined;

  return value;
};

export const getOrGeneratePlayerId = (playerId?: string) => {
  if (playerId) {
    localStorage.setItem(LocalStorageKeys.PLAYER_ID, playerId);
    return playerId;
  }

  playerId = getFromLocalStorage(LocalStorageKeys.PLAYER_ID);

  if (!playerId) {
    playerId = generatePlayerId();
    localStorage.setItem(LocalStorageKeys.PLAYER_ID, playerId);
  }

  return playerId;
}

export const FIVE_MINUTES = 5 * 60 * 1000;

export const getGameRoom = (roomCode?: string) => {
  if (roomCode) {
    localStorage.setItem(LocalStorageKeys.ROOM_CODE, roomCode);
    return roomCode;
  }

  const expirationTime = getFromLocalStorage(LocalStorageKeys.ROOM_CODE_EXPIRATION);

  if (expirationTime && Date.now() - Number(expirationTime) < 0) {
    roomCode = getFromLocalStorage(LocalStorageKeys.ROOM_CODE);
  } else {
    localStorage.removeItem(LocalStorageKeys.ROOM_CODE_EXPIRATION);
  }

  if (roomCode) {
    localStorage.setItem(LocalStorageKeys.AUTO_CONNECT, true.toString());
  } else {
    localStorage.setItem(LocalStorageKeys.AUTO_CONNECT, false.toString());
  }

  return roomCode;
}

export const getName = (name?: string) => {
  if (name) {
    localStorage.setItem(LocalStorageKeys.NAME, name);
    return name;
  }

  return getFromLocalStorage(LocalStorageKeys.NAME);
};
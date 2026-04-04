import { createStore } from "zustand/vanilla";
import { PhoneClientAppsOptionalProps } from "../App";
import { GameCanvasControls } from "../types/types";
import { Ref } from "react";

export enum GameMode {
  DEBUG,
  BLANK,
  SINGLE_BUTTON,
}

export type CanvasState = {
  pointer?: PointerObject;
  isPointerDown: boolean;
  objects: CanvasObject[];
  pointerDownStart?: PointerDownObject;
};

export type PointerObject = {
  x: number;
  y: number;
};

export type PointerDownObject = {
  time: number;
} & PointerObject;

export type CanvasObject = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  time?: number; // optional, number of seconds for this to live on screen
};

export const defaultCanvasState = (): CanvasState => ({
  isPointerDown: false,
  objects: [],
});

export type PhoneClientState = {
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  name: string;
  setName: (name: string) => void;
  playerId: string;
  setPlayerId: (playerId: string) => void;
  isConnectedToGameRoom: boolean;
  setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) => void;
  ref?: Ref<GameCanvasControls>;
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
};

export const createPhoneClientStore = (optionalProps: PhoneClientAppsOptionalProps) =>
  createStore<PhoneClientState>((set) => ({
    roomCode: optionalProps.roomCode || "",
    setRoomCode: (roomCode: string) =>
      set(() => ({
        roomCode: roomCode.toUpperCase(),
      })),
    name: optionalProps.name || "",
    setName: (name: string) => set(() => ({ name })),
    playerId: optionalProps.playerId || "",
    setPlayerId: (playerId: string) => set(() => ({ playerId })),
    isConnectedToGameRoom: false,
    setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) =>
      set(() => ({ isConnectedToGameRoom })),
    ref: optionalProps.ref,
    gameMode: GameMode.DEBUG,
    setGameMode: (gameMode: GameMode) => set(() => ({ gameMode })),
  }));

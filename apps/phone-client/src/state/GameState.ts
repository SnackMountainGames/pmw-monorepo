import { create } from "zustand";

export type CanvasState = {
  pointer?: PointerObject;
  isPointerDown: boolean;
  objects: CanvasObject[];
  pointerDownStart?: PointerDownObject;
};

export type PointerObject = {
  x: number;
  y: number;
}

export type PointerDownObject = {
  time: number;
} & PointerObject;

export type CanvasObject = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    time?: number; // optional, number of seconds for this to live on screen
}

export const defaultCanvasState: CanvasState = {
  isPointerDown: false,
  objects: [],
};

type GameStore = {
    roomCode: string;
    setRoomCode: (roomCode: string) => void;
    name: string;
    setName: (name: string) => void;
    isConnectedToGameRoom: boolean;
    setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  roomCode: '',
  setRoomCode: (roomCode: string) => set(() => ({ roomCode })),
  name: '',
  setName: (name: string) => set(() => ({ name })),
  isConnectedToGameRoom: false,
  setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) =>
    set(() => ({ isConnectedToGameRoom })),
}));
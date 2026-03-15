import { createStore } from 'zustand/vanilla';
import { PhoneClientAppsOptionalProps } from '../App';
import { GameCanvasControls } from '../types/types';
import { Ref } from 'react';

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

export const defaultCanvasState = (): CanvasState => ({
  isPointerDown: false,
  objects: [],
});

export type PhoneClientState = {
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  name: string;
  setName: (name: string) => void;
  isConnectedToGameRoom: boolean;
  setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) => void;
  ref?: Ref<GameCanvasControls>;
};

export const createPhoneClientStore = (optionalProps: PhoneClientAppsOptionalProps) =>
  createStore<PhoneClientState>((set) => ({
    roomCode: optionalProps.roomCode || '',
    setRoomCode: (roomCode: string) =>
      set(() => ({
        roomCode: roomCode.toUpperCase(),
      })),
    name: optionalProps.name || '',
    setName: (name: string) => set(() => ({ name })),
    isConnectedToGameRoom: false,
    setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) =>
      set(() => ({ isConnectedToGameRoom })),
    ref: optionalProps.ref,
  }));
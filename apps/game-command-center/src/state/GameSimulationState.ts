import { create } from "zustand";
import { ReactNode } from 'react';

type GameSimulationStore = {
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  isConnectedToGameRoom: boolean;
  setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) => void;
  phoneClients: ReactNode[];
  setPhoneClients: (phoneClients: ReactNode[]) => void;
};

export const useGameSimulationStore = create<GameSimulationStore>((set) => ({
  roomCode: '',
  setRoomCode: (roomCode: string) => set(() => ({
    roomCode: roomCode.toUpperCase(),
  })),
  isConnectedToGameRoom: false,
  setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) =>
    set(() => ({ isConnectedToGameRoom })),
  phoneClients: [],
  setPhoneClients: (phoneClients: ReactNode[]) =>
    set(() => ({ phoneClients })),
}));
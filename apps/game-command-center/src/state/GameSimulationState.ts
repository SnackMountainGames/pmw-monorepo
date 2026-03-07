import { create } from "zustand";

type GameSimulationStore = {
    roomCode: string;
    setRoomCode: (roomCode: string) => void;
    isConnectedToGameRoom: boolean;
    setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) => void;
};

export const useGameSimulationStore = create<GameSimulationStore>((set) => ({
  roomCode: '',
  setRoomCode: (roomCode: string) => set(() => ({
    roomCode: roomCode.toUpperCase(),
  })),
  isConnectedToGameRoom: false,
  setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) =>
    set(() => ({ isConnectedToGameRoom })),
}));
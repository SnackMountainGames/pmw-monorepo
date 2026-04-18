import { create } from "zustand";
import { ReactNode } from "react";
import { GameCanvasControls } from "phone-client";

type GameSimulationStore = {
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  isConnectedToGameRoom: boolean;
  setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) => void;
  phoneClientMap: Map<string, ReactNode>;
  setPhoneClientMap: (phoneClientMap: Map<string, ReactNode>) => void;
  phoneClientRefMap: Map<string, GameCanvasControls>;
  // phoneClients: ReactNode[];
  // setPhoneClients: (phoneClients: ReactNode[]) => void;
};

export const useGameSimulationStore = create<GameSimulationStore>((set) => ({
  roomCode: "",
  setRoomCode: (roomCode: string) =>
    set(() => ({
      roomCode: roomCode.toUpperCase(),
    })),
  isConnectedToGameRoom: false,
  setIsConnectedToGameRoom: (isConnectedToGameRoom: boolean) =>
    set(() => ({ isConnectedToGameRoom })),
  phoneClientMap: new Map(),
  setPhoneClientMap: (phoneClientMap: Map<string, ReactNode>) => set(() => ({ phoneClientMap })),
  phoneClientRefMap: new Map(),
  // phoneClients: [],
  // setPhoneClients: (phoneClients: ReactNode[]) => set(() => ({ phoneClients })),
}));

import { createStore } from "zustand/vanilla";

export type SingleButtonGameModeState = {
  isButtonActivated: boolean;
  setIsButtonActivated: (isButtonActivated: boolean) => void;
  activationPercent: number;
  setActivationPercent: (activationPercent: number) => void;
};

export const singleButtonGameModeStore = createStore<SingleButtonGameModeState>(
  (set) => ({
    isButtonActivated: false,
    setIsButtonActivated: (isButtonActivated: boolean) =>
      set({ isButtonActivated }),
    activationPercent: 0,
    setActivationPercent: (activationPercent: number) =>
      set({ activationPercent }),
  }),
);

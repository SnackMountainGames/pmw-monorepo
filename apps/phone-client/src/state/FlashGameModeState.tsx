import { createStore } from "zustand/vanilla";
import { createContext, ReactNode, useContext, useRef } from "react";

export type FlashGameModeState = {
  intensity: number;
  maxIntensity: number;
  rateOfDecay: number;
};

export const FlashGameModeStore = () => createStore<FlashGameModeState>(
  (set) => ({
    intensity: 0,
    maxIntensity: 0,
    rateOfDecay: 1,
  })
);

const FlashGameModeStoreContext = createContext<ReturnType<
  typeof FlashGameModeStore
> | null>(null);

export type FlashGameModeStoreProviderProps = {
  children: ReactNode;
};

export const FlashGameModeStoreProvider = (
  props: FlashGameModeStoreProviderProps,
) => {
  const { children } = props;

  const storeRef = useRef<ReturnType<typeof FlashGameModeStore>>(
    FlashGameModeStore(),
  );

  return (
    <FlashGameModeStoreContext.Provider value={storeRef.current}>
      {children}
    </FlashGameModeStoreContext.Provider>
  );
};

export function useFlashGameModeStore() {
  const store = useContext(FlashGameModeStoreContext);

  if (!store) {
    throw new Error(
      "useFlashGameModeStore must be used inside FlashGameModeStoreProvider",
    );
  }
  return store;
}
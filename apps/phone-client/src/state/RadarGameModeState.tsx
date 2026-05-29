import { createStore } from "zustand/vanilla";
import { createContext, ReactNode, useContext, useRef } from "react";
import { Vector2D } from "./GameState";

export type RadarGameModeState = {
  location?: Vector2D;
};

export const RadarGameModeStore = () => createStore<RadarGameModeState>(
  (set) => ({})
);

const RadarGameModeStoreContext = createContext<ReturnType<
  typeof RadarGameModeStore
> | null>(null);

export type RadarGameModeStoreProviderProps = {
  children: ReactNode;
};

export const RadarGameModeStoreProvider = (
  props: RadarGameModeStoreProviderProps,
) => {
  const { children } = props;

  const storeRef = useRef<ReturnType<typeof RadarGameModeStore>>(
    RadarGameModeStore(),
  );

  return (
    <RadarGameModeStoreContext.Provider value={storeRef.current}>
      {children}
    </RadarGameModeStoreContext.Provider>
  );
};

export function useRadarGameModeStore() {
  const store = useContext(RadarGameModeStoreContext);

  if (!store) {
    throw new Error(
      "useRadarGameModeStore must be used inside RadarGameModeStoreProvider",
    );
  }
  return store;
}
import { createStore } from "zustand/vanilla";
import { createContext, ReactNode, useContext, useRef } from "react";

export type SingleButtonGameModeState = {
  isButtonActivated: boolean;
  setIsButtonActivated: (isButtonActivated: boolean) => void;
  activationPercent: number;
  setActivationPercent: (activationPercent: number) => void;
};

export const singleButtonGameModeStore = () => createStore<SingleButtonGameModeState>(
  (set) => ({
    isButtonActivated: false,
    setIsButtonActivated: (isButtonActivated: boolean) =>
      set({ isButtonActivated }),
    activationPercent: 0,
    setActivationPercent: (activationPercent: number) =>
      set({ activationPercent }),
  }),
);

const SingleButtonGameModeStoreContext = createContext<ReturnType<
  typeof singleButtonGameModeStore
> | null>(null);

export type SingleButtonGameModeStoreProviderProps = {
  children: ReactNode;
};

export const SingleButtonGameModeStoreProvider = (
  props: SingleButtonGameModeStoreProviderProps,
) => {
  const { children } = props;

  const storeRef = useRef<ReturnType<typeof singleButtonGameModeStore>>(
    singleButtonGameModeStore(),
  );

  return (
    <SingleButtonGameModeStoreContext.Provider value={storeRef.current}>
      {children}
    </SingleButtonGameModeStoreContext.Provider>
  );
};

export function useSingleButtonGameModeStore() {
  const store = useContext(SingleButtonGameModeStoreContext);

  if (!store) {
    throw new Error(
      "useSingleButtonGameModeStore must be used inside SingleButtonGameModeStoreProvider",
    );
  }
  return store;
}
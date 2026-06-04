import { createStore } from "zustand/vanilla";
import { createContext, ReactNode, useContext, useRef } from "react";

export type SingleButtonHoldGameModeState = {
  isButtonActivated: boolean;
  setIsButtonActivated: (isButtonActivated: boolean) => void;
  activationPercent: number;
  setActivationPercent: (activationPercent: number) => void;
};

export const singleButtonHoldGameModeStore = () => createStore<SingleButtonHoldGameModeState>(
  (set) => ({
    isButtonActivated: false,
    setIsButtonActivated: (isButtonActivated: boolean) =>
      set({ isButtonActivated }),
    activationPercent: 0,
    setActivationPercent: (activationPercent: number) =>
      set({ activationPercent }),
  }),
);

const SingleButtonHoldGameModeStoreContext = createContext<ReturnType<
  typeof singleButtonHoldGameModeStore
> | null>(null);

export type SingleButtonHoldGameModeStoreProviderProps = {
  children: ReactNode;
};

export const SingleButtonHoldGameModeStoreProvider = (
  props: SingleButtonHoldGameModeStoreProviderProps,
) => {
  const { children } = props;

  const storeRef = useRef<ReturnType<typeof singleButtonHoldGameModeStore>>(
    singleButtonHoldGameModeStore(),
  );

  return (
    <SingleButtonHoldGameModeStoreContext.Provider value={storeRef.current}>
      {children}
    </SingleButtonHoldGameModeStoreContext.Provider>
  );
};

export function useSingleButtonHoldGameModeStore() {
  const store = useContext(SingleButtonHoldGameModeStoreContext);

  if (!store) {
    throw new Error(
      "useSingleButtonHoldGameModeStore must be used inside SingleButtonHoldGameModeStoreProvider",
    );
  }
  return store;
}
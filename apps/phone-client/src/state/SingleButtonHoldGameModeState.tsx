import { createStore } from "zustand/vanilla";
import { createContext, ReactNode, useContext, useRef } from "react";
import { BackgroundState } from "../components/canvas/CanvasUtilities";

export type SingleButtonHoldGameModeState = {
  isButtonActivated: boolean;
  setIsButtonActivated: (isButtonActivated: boolean) => void;
  pointerId?: number;
  setPointerId: (pointerId: number | undefined) => void;
  background: BackgroundState;
};

export const singleButtonHoldGameModeStore = () =>
  createStore<SingleButtonHoldGameModeState>((set) => ({
    isButtonActivated: false,
    setIsButtonActivated: (isButtonActivated: boolean) =>
      set({ isButtonActivated }),
    setPointerId: (pointerId: number | undefined) => set({ pointerId }),
    background: {
      color: "#8f822f",
    },
  }));

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
import { createStore } from "zustand/vanilla";
import { createContext, ReactNode, useContext, useRef } from "react";

export type SingleButtonTapGameModeState = {
  isButtonActivated: boolean;
  setIsButtonActivated: (isButtonActivated: boolean) => void;
  timeActivated: number;
  setTimeActivated: (timeActivated: number) => void;
  timeSinceLastMessage: number;
  setTimeSinceLastMessage: (timeSinceLastMessage: number) => void;
  tapCount: number;
  incrementTapCount: () => void;
  resetTapCount: () => void;
  pointerId?: number;
  setPointerId: (pointerId: number | undefined) => void;
};

export const SingleButtonTapGameModeStore = () =>
  createStore<SingleButtonTapGameModeState>((set) => ({
    isButtonActivated: false,
    setIsButtonActivated: (isButtonActivated: boolean) =>
      set({ isButtonActivated }),
    timeActivated: 0,
    setTimeActivated: (timeActivated: number) => set({ timeActivated }),
    timeSinceLastMessage: 0,
    setTimeSinceLastMessage: (timeSinceLastMessage: number) =>
      set({ timeSinceLastMessage }),
    tapCount: 0,
    incrementTapCount: () => set((state) => ({ tapCount: state.tapCount + 1 })),
    resetTapCount: () => set({ tapCount: 0 }),
    setPointerId: (pointerId: number | undefined) => set({ pointerId }),
  }));

const SingleButtonTapGameModeStoreContext = createContext<ReturnType<
  typeof SingleButtonTapGameModeStore
> | null>(null);

export type SingleButtonTapGameModeStoreProviderProps = {
  children: ReactNode;
};

export const SingleButtonTapGameModeStoreProvider = (
  props: SingleButtonTapGameModeStoreProviderProps,
) => {
  const { children } = props;

  const storeRef = useRef<ReturnType<typeof SingleButtonTapGameModeStore>>(
    SingleButtonTapGameModeStore(),
  );

  return (
    <SingleButtonTapGameModeStoreContext.Provider value={storeRef.current}>
      {children}
    </SingleButtonTapGameModeStoreContext.Provider>
  );
};

export function useSingleButtonTapGameModeStore() {
  const store = useContext(SingleButtonTapGameModeStoreContext);

  if (!store) {
    throw new Error(
      "useSingleButtonTapGameModeStore must be used inside SingleButtonTapGameModeStoreProvider",
    );
  }
  return store;
}
import { createStore } from "zustand/vanilla";
import { createContext, ReactNode, useContext, useRef } from "react";
import { BackgroundState } from "../../components/canvas/CanvasUtilities";

export type SwipeGameModeState = {
  pointerId?: number;
  setPointerId: (pointerId: number | undefined) => void;
  pointerStart?: PointerStartObject;
  setPointerStart: (pointerStart: PointerStartObject | undefined) => void;
  tutorial?: {
    swipesRemaining: number;
    swipeTime: number;
    timeSinceLastMove: number;
  };
  background: BackgroundState;
};

type Vector2D = {
  x: number;
  y: number;
};

type PointerStartObject = {
  time: number;
} & Vector2D;

export const SwipeGameModeStore = () =>
  createStore<SwipeGameModeState>((set) => ({
    setPointerId: (pointerId: number | undefined) => set({ pointerId }),
    setPointerStart: (pointerStart: PointerStartObject | undefined) =>
      set({ pointerStart }),
    background: {
      color: "#692727",
    },
  }));

const SwipeGameModeStoreContext = createContext<ReturnType<
  typeof SwipeGameModeStore
> | null>(null);

export type SwipeGameModeStoreProviderProps = {
  children: ReactNode;
};

export const SwipeGameModeStoreProvider = (
  props: SwipeGameModeStoreProviderProps,
) => {
  const { children } = props;

  const storeRef = useRef<ReturnType<typeof SwipeGameModeStore>>(
    SwipeGameModeStore(),
  );

  return (
    <SwipeGameModeStoreContext.Provider value={storeRef.current}>
      {children}
    </SwipeGameModeStoreContext.Provider>
  );
};

export function useSwipeGameModeStore() {
  const store = useContext(SwipeGameModeStoreContext);

  if (!store) {
    throw new Error(
      "useSwipeGameModeStore must be used inside SwipeGameModeStoreProvider",
    );
  }
  return store;
}
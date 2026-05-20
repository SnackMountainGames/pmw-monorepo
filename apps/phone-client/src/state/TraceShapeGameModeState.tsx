import { createStore } from "zustand/vanilla";
import { createContext, ReactNode, useContext, useRef } from "react";
import { Vector2D } from "./GameState";

export type TraceShapeGameModeState = {
  isDrawing: boolean;
  distance: number;
  userPoints: Vector2D[];
  shapePoints: ShapeVector2D[];
  shapeDistance: number;
};

export type ShapeVector2D = Vector2D & {
  isCovered: boolean;
}

export const TraceShapeGameModeStore = () => createStore<TraceShapeGameModeState>(
  (set) => ({
    isDrawing: false,
    distance: 0,
    userPoints: [],
    shapePoints: [],
    shapeDistance: 0,
  })
);

const TraceShapeGameModeStoreContext = createContext<ReturnType<
  typeof TraceShapeGameModeStore
> | null>(null);

export type TraceShapeGameModeStoreProviderProps = {
  children: ReactNode;
};

export const TraceShapeGameModeStoreProvider = (
  props: TraceShapeGameModeStoreProviderProps,
) => {
  const { children } = props;

  const storeRef = useRef<ReturnType<typeof TraceShapeGameModeStore>>(
    TraceShapeGameModeStore(),
  );

  return (
    <TraceShapeGameModeStoreContext.Provider value={storeRef.current}>
      {children}
    </TraceShapeGameModeStoreContext.Provider>
  );
};

export function useTraceShapeGameModeStore() {
  const store = useContext(TraceShapeGameModeStoreContext);

  if (!store) {
    throw new Error(
      "useTraceShapeGameModeStore must be used inside TraceShapeGameModeStoreProvider",
    );
  }
  return store;
}
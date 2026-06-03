import { SingleButtonGameModeStoreProvider } from "../state/SingleButtonGameModeState";
import { TraceShapeGameModeStoreProvider } from "../state/TraceShapeGameModeState";
import { RadarGameModeStoreProvider } from "../state/RadarGameModeState";
import { FlashGameModeStoreProvider } from "../state/FlashGameModeState";
import { ReactNode } from "react";

interface GameModeProvidersProps {
  children: ReactNode;
}

export const GameModeProviders = (props: GameModeProvidersProps) => {
  const { children } = props;

  return (
    <SingleButtonGameModeStoreProvider>
      <TraceShapeGameModeStoreProvider>
        <RadarGameModeStoreProvider>
          <FlashGameModeStoreProvider>
            {children}
          </FlashGameModeStoreProvider>
        </RadarGameModeStoreProvider>
      </TraceShapeGameModeStoreProvider>
    </SingleButtonGameModeStoreProvider>
  );
};
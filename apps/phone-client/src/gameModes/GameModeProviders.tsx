import { SingleButtonHoldGameModeStoreProvider } from "../state/SingleButtonHoldGameModeState";
import { TraceShapeGameModeStoreProvider } from "../state/TraceShapeGameModeState";
import { RadarGameModeStoreProvider } from "../state/RadarGameModeState";
import { FlashGameModeStoreProvider } from "../state/FlashGameModeState";
import { ReactNode } from "react";
import { SingleButtonTapGameModeStoreProvider } from "../state/SingleButtonTapGameModeState";

interface GameModeProvidersProps {
  children: ReactNode;
}

export const GameModeProviders = (props: GameModeProvidersProps) => {
  const { children } = props;

  return (
    <SingleButtonHoldGameModeStoreProvider>
      <SingleButtonTapGameModeStoreProvider>
        <TraceShapeGameModeStoreProvider>
          <RadarGameModeStoreProvider>
            <FlashGameModeStoreProvider>
              {children}
            </FlashGameModeStoreProvider>
          </RadarGameModeStoreProvider>
        </TraceShapeGameModeStoreProvider>
      </SingleButtonTapGameModeStoreProvider>
    </SingleButtonHoldGameModeStoreProvider>
  );
};
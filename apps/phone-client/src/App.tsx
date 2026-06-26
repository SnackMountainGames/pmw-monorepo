import { PhoneClientStoreProvider } from "./state/PhoneClientStoreProvider";
import { WebSocketProvider } from "shared-component-library";
import { Router } from "./components/Router";
import { GameCanvasControls } from "./types/types";
import { Ref } from "react";
import { GameModeProviders } from "./gameModes/GameModeProviders";
import {
  getGameRoom,
  getName,
  getOrGeneratePlayerId,
} from "./utilities/LocalStorageUtilities";

export type PhoneClientAppsOptionalProps = {
  roomCode?: string;
  name?: string;
  playerId?: string;
  ref?: Ref<GameCanvasControls>;
  debug?: boolean;
};

export const PhoneClientApp = (optionalProps: PhoneClientAppsOptionalProps) => {
  const { ref, debug } = optionalProps;

  return (
    <WebSocketProvider>
      <PhoneClientStoreProvider
        roomCode={getGameRoom(optionalProps.roomCode)}
        name={getName(optionalProps.name)}
        playerId={getOrGeneratePlayerId(optionalProps.playerId)}
        ref={ref}
        debug={debug}
      >
        <GameModeProviders>
          <Router />
        </GameModeProviders>
      </PhoneClientStoreProvider>
    </WebSocketProvider>
  );
};

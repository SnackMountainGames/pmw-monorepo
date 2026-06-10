import { PhoneClientStoreProvider } from "./state/PhoneClientStoreProvider";
import { WebSocketProvider } from "shared-component-library";
import { Router } from "./components/Router";
import { GameCanvasControls } from "./types/types";
import { Ref } from "react";
import { generatePlayerId } from "./utilities/generatePlayerId";
import { GameModeProviders } from "./gameModes/GameModeProviders";

export type PhoneClientAppsOptionalProps = {
  roomCode?: string;
  name?: string;
  playerId?: string;
  ref?: Ref<GameCanvasControls>;
  debug?: boolean;
};

export const PhoneClientApp = (optionalProps: PhoneClientAppsOptionalProps) => {
  const { roomCode, name, ref, debug } = optionalProps;

  let playerId: string | undefined | null = optionalProps.playerId;

  if (!playerId) {
    playerId = localStorage.getItem("pmw-playerId");

    if (!playerId) {
      playerId = generatePlayerId();
      localStorage.setItem("pmw-playerId", playerId);
    }
  }

  return (
    <WebSocketProvider>
      <PhoneClientStoreProvider
        roomCode={roomCode}
        name={name}
        playerId={playerId}
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

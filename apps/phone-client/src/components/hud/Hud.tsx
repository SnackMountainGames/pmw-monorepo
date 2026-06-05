import styled from "@emotion/styled";
import { usePhoneClientStore } from "../../state/PhoneClientStoreProvider";
import { GameMode } from "shared-type-library";

export const TOP_HUD_HEIGHT = 60;
export const BOTTOM_HUD_HEIGHT = 60;

const TopHudContainer = styled.div`
  height: ${TOP_HUD_HEIGHT}px;
  box-sizing: border-box;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  background-color: black;
`;

const HudButton = styled.button`
  color: white;
  background: none;
  border: 2px solid white;
  pointer-events: all;
  height: ${TOP_HUD_HEIGHT}px;
  width: ${TOP_HUD_HEIGHT}px;
`;

export const TopHud = () => {
  const roomCode = usePhoneClientStore((state) => state.roomCode);
  const name = usePhoneClientStore((state) => state.name);
  const gameMode = usePhoneClientStore((state) => state.gameMode);
  const setGameMode = usePhoneClientStore((state) => state.setGameMode);
  const debug = usePhoneClientStore((state) => state.debug);
  const toggleDebug = usePhoneClientStore((state) => state.toggleDebug);

  return (
    <TopHudContainer id="game-hud">
      <div>
        <HudButton
          onClick={() => {
            const newGameMode = gameMode + 1;
            if (newGameMode >= Object.keys(GameMode).length / 2) {
              setGameMode(0);
            } else {
              setGameMode(newGameMode);
            }
          }}
        >
          Change Game Mode
        </HudButton>
      </div>
      <div>
        {roomCode ? (
          <span>
            In room {roomCode} as {name}
          </span>
        ) : (
          <span>⚠ Offline ⚠</span>
        )}
      </div>
      <div>
        <HudButton onClick={toggleDebug}>{`Debug: ${debug}`}</HudButton>
      </div>
    </TopHudContainer>
  );
};

const BottomHudContainer = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
`;

export const BottomHud = () => {
  const gameMode = usePhoneClientStore((state) => state.gameMode);

  const key = Object.keys(GameMode)[Object.values(GameMode).indexOf(gameMode)];
  const label = key.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return <BottomHudContainer id="game-hud">{label}</BottomHudContainer>;
};

import styled from "@emotion/styled";
import { usePhoneClientStore } from "../../state/PhoneClientStoreProvider";
import { GameMode } from "shared-type-library";
import { LocalStorageKeys } from "../../utilities/LocalStorageUtilities";
import { DEVELOPMENT_BUILD } from "../../App";

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
  border: none;
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

  const changeGameMode = () => {
    const newGameMode = gameMode + 1;
    if (newGameMode >= Object.keys(GameMode).length / 2) {
      setGameMode(0);
    } else {
      setGameMode(newGameMode);
    }
  }

  const GameModeButton = () => {
    if (DEVELOPMENT_BUILD) {
      return (
        <HudButton onMouseDown={changeGameMode}>Change Game Mode</HudButton>
      );
    } else {
      return <HudButton />;
    }
  };

  const DebugButton = () => {
    if (DEVELOPMENT_BUILD) {
      return (
        <HudButton onMouseDown={toggleDebug}>{`Debug: ${debug}`}</HudButton>
      );
    } else {
      return (
        <HudButton />
      )
    }
  }

  return (
    <TopHudContainer id="game-hud">
      <GameModeButton />
      {roomCode ? (
        <span>
          In room {roomCode} as {name}
        </span>
      ) : (
        <span>⚠ Offline ⚠</span>
      )}
      <DebugButton />
    </TopHudContainer>
  );
};

const BottomHudContainer = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
`;

export const BottomHud = () => {
  const gameMode = usePhoneClientStore((state) => state.gameMode);
  const setRoomCode = usePhoneClientStore((state) => state.setRoomCode);
  const setIsConnectedToGameRoom = usePhoneClientStore(
    (state) => state.setIsConnectedToGameRoom,
  );

  const key = Object.keys(GameMode)[Object.values(GameMode).indexOf(gameMode)];
  const label = key.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const exitRoom = () => {
    localStorage.removeItem(LocalStorageKeys.ROOM_CODE_EXPIRATION);
    localStorage.removeItem(LocalStorageKeys.ROOM_CODE);
    localStorage.setItem(LocalStorageKeys.AUTO_CONNECT, false.toString());
    setRoomCode("");
    setIsConnectedToGameRoom(false);
  }

  return (
    <BottomHudContainer id="game-hud">
      <HudButton />
      {label}
      <HudButton onMouseDown={exitRoom}>Exit Room</HudButton>
    </BottomHudContainer>
  );
};

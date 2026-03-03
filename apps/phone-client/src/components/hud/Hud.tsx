import { useGameStore } from '../../state/GameState';
import styled from '@emotion/styled';

export const TOP_HUD_HEIGHT = 60;
export const BOTTOM_HUD_HEIGHT = 60;

const TopHud = styled.div`
  //position: absolute;
  //left: 0;
  //right: 0;
  height: ${TOP_HUD_HEIGHT}px;
  box-sizing: border-box;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HudButton = styled.button`
  border: none;
  pointer-events: all;
  height: ${TOP_HUD_HEIGHT}px;
  width: ${TOP_HUD_HEIGHT}px;
`;

export const Hud = () => {
  const { roomCode, name } = useGameStore();

  return (
    <TopHud id="game-hud">
      <div>
        <HudButton onClick={() => console.log('HUD Button Left')}>?</HudButton>
      </div>
      <div>
        {roomCode ? (
          <span>Successfully joined room {roomCode} as {name} 🎉</span>
        ) : (
          <span>⚠ Not actually in a room (testing) ⚠</span>
        )}
      </div>
      <div>
        <HudButton onClick={() => console.log('HUD Button Right')}>?</HudButton>
      </div>
    </TopHud>
  );
}
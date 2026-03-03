import { useGameStore } from '../../state/GameState';
import styled from '@emotion/styled';

const TopHud = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    box-sizing: border-box;
    pointer-events: none;
    touch-action: none;
    user-select: none;
    display: flex;
    justify-content: center;
    margin: 20;
`;

export const Hud = () => {
  const { roomCode, name } = useGameStore();

  return (
    <TopHud id="game-hud">
      {roomCode ? (
        <h2>
          Successfully joined room {roomCode} as {name} 🎉
        </h2>
      ) : (
        <h2>⚠ Not actually in a room (testing) ⚠</h2>
      )}
    </TopHud>
  );
}
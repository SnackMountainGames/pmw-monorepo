import { useGameStore } from '../../state/GameState';

export const Hud = () => {
  const { roomCode, name } = useGameStore();

  return (
    <div
      id="game-hud"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        boxSizing: 'border-box',
        pointerEvents: 'none',
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        margin: 20,
      }}
    >
      {roomCode ? (
        <h2>
          Successfully joined room {roomCode} as {name} 🎉
        </h2>
      ) : (
        <h2>⚠ Not actually in a room (testing) ⚠</h2>
      )}
    </div>
  );
}
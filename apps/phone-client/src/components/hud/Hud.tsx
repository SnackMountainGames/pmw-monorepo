import { useGameStore } from '../../state/GameState';

export const Hud = () => {
  const { roomCode, name } = useGameStore();

  return (
    <div
      id="game-hud"
      style={{
        position: 'absolute',
        width: '100%',
        pointerEvents: 'none',
        touchAction: 'none',
        userSelect: 'none',
        paddingLeft: 20,
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
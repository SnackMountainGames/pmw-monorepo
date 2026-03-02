import { useGameStore } from '../state/GameState';

export const Hud = () => {
  const { roomCode, name } = useGameStore();

  return (
    <div style={{ position: "absolute", width: "100%", pointerEvents: "none", touchAction: "none", userSelect: "none" }} >
      <h2>
        Successfully joined room {roomCode} as {name} 🎉
      </h2>
    </div>
  );
}
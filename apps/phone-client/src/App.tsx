import { WebSocketProvider } from 'shared-component-library';
import { useGameStore } from './state/GameState';
import { WelcomeMenu } from './components/WelcomeMenu';
import { GameCanvas } from './components/canvas/GameCanvas';
import { Hud } from './components/hud/Hud';

export function App() {
  const { isConnectedToGameRoom } = useGameStore();

  return (
    <WebSocketProvider>
      {!isConnectedToGameRoom ? (
        <WelcomeMenu />
      ) : (
        <>
          <Hud />
          <GameCanvas />
        </>
      )}
    </WebSocketProvider>
  );
}
import {
  ConnectionStatus,
  ServerMessage,
  ServerMessageAction,
  useSharedWebSocket,
} from 'shared-component-library';
import { useGameStore } from '../state/GameState';
import { useEffect } from 'react';

export const WelcomeMenu = () => {
  const { roomCode, setRoomCode, name, setName, setIsConnectedToGameRoom } = useGameStore();

  const { connected, subscribe, send } = useSharedWebSocket();

  useEffect(() => {
    return subscribe((message: ServerMessage) => {
      if (message.type === ServerMessageAction.JOINED_ROOM) {
        setIsConnectedToGameRoom(true);
      }
    });
  }, [subscribe]);

  const joinRoom = () => {
    send({
      action: 'joinRoom',
      roomCode,
      name,
    });
  }

  return (
    <div>
      <h1>PMW Phone Client</h1>
      <ConnectionStatus />

      <input
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />

      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />

      <button onClick={joinRoom} disabled={!connected}>
        Join Room
      </button>
    </div>
  );
};
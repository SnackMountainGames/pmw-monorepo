import styled from '@emotion/styled';
import { useGameSimulationStore } from '../state/GameSimulationState';
import {
  Player,
  ServerMessage,
  ServerMessageAction,
  useSharedWebSocket,
} from 'shared-component-library';
import { useEffect, useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 20px;
  border: 2px solid grey;
  border-radius: 10px;
  margin: 20px;
`;

export const GameHostSection = () => {
  const { roomCode, setRoomCode } = useGameSimulationStore();

  const { connected, subscribe, send } = useSharedWebSocket();

  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    return subscribe((message: ServerMessage) => {
      console.log(message);
      if (message.type === ServerMessageAction.ROOM_CREATED && message.roomCode) {
        setRoomCode(message.roomCode);
        setIsRoomCreated(true);
      }

      if (message.type === ServerMessageAction.PLAYER_LIST_UPDATED) {
        setPlayers(message.players || []);
      }

      if (message.type === ServerMessageAction.PHONE_MESSAGE) {
        console.log('Message from phone:', message.text);
        console.log('From:', message.from);
      }
    });
  }, [subscribe]);

  const createRoom = () => {
    send({
      action: 'createRoom',
    });
  };

  return (
    <Container>
      {!isRoomCreated && (
        <button onClick={createRoom} disabled={!connected}>
          Create Room
        </button>
      )}
      {isRoomCreated && (
        <>
          <h2>Room Code: {roomCode}</h2>

          <h3>Active Players: {players.length}</h3>

          <ul>
            {players.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
        </>
      )}
    </Container>
  );
};
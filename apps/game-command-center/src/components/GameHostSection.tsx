import styled from "@emotion/styled";
import { useGameSimulationStore } from "../state/GameSimulationState";
import { useSharedWebSocket } from "shared-component-library";
import { useEffect, useState } from "react";
import {
  ClientEventAction,
  ClientEventSendMessageType,
  GameMode,
  Rider,
  ServerEvent,
  ServerEventType,
} from "shared-type-library";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 20px;
  border: 2px solid grey;
  border-radius: 10px;
  margin: 20px 20px 20px 0;
`;

export const GameHostSection = () => {
  const { roomCode, setRoomCode } = useGameSimulationStore();

  const { connected, subscribe, send } = useSharedWebSocket();

  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [riders, setRiders] = useState<Rider[]>([]);

  useEffect(() => {
    return subscribe((message: ServerEvent) => {
      console.log("Host", message);
      if (message.type === ServerEventType.ROOM_CREATED) {
        setRoomCode(message.roomCode);
        setIsRoomCreated(true);
      }

      if (message.type === ServerEventType.PLAYER_LIST_UPDATED) {
        setRiders(message.players || []);
      }

      if (message.type === ServerEventType.CLIENT_MESSAGE_TEXT) {
        const rider = riders.find((rider) => rider.playerId === message.from);
        console.log(`${rider?.name} says "${message.text}"`);
      }
    });
  }, [setRoomCode, subscribe, riders]);

  const createRoom = () => {
    send({
      action: ClientEventAction.CREATE_ROOM,
    });
  };

  const changeGameMode = (mode: GameMode) => {
    send({
      action: ClientEventAction.SEND_MESSAGE,
      to: "all",
      type: ClientEventSendMessageType.CHANGE_GAME_MODE,
      mode,
    });
  }

  return (
    <Container>
      <h2>Game Host</h2>
      {!isRoomCreated && (
        <button onClick={createRoom} disabled={!connected}>
          Create Room
        </button>
      )}
      {isRoomCreated && (
        <>
          <h2>Room Code: {roomCode}</h2>

          <h3>Connected Riders: {riders.length}</h3>

          <ul>
            {riders
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((rider) => (
                <li key={rider.playerId}>{rider.name}</li>
              ))}
          </ul>

          <h3>Change game mode</h3>
          <button onClick={() => changeGameMode(GameMode.BLANK)}>Blank</button>
          <br/>&nbsp;
          <button onClick={() => changeGameMode(GameMode.SINGLE_BUTTON)}>Single Button</button>
        </>
      )}
    </Container>
  );
};

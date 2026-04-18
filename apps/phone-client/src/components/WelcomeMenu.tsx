import { ConnectionStatus, useSharedWebSocket } from "shared-component-library";
import { useEffect } from "react";
import { usePhoneClientStore } from "../state/PhoneClientStoreProvider";
import {
  ClientEventAction,
  GameMode,
  ServerEvent,
  ServerEventType,
} from "shared-type-library";
import styled from "@emotion/styled";

const WelcomePage = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const Button = styled.button`
  border: 2px solid darkslateblue;
  font-size: 20px;
`;

export const WelcomeMenu = () => {
  const roomCode = usePhoneClientStore((state) => state.roomCode);
  const setRoomCode = usePhoneClientStore((state) => state.setRoomCode);
  const name = usePhoneClientStore((state) => state.name);
  const setName = usePhoneClientStore((state) => state.setName);
  const playerId = usePhoneClientStore((state) => state.playerId);
  const setIsConnectedToGameRoom = usePhoneClientStore(
    (state) => state.setIsConnectedToGameRoom,
  );
  const setGameMode = usePhoneClientStore((state) => state.setGameMode);

  const { connected, subscribe, send, disconnect } = useSharedWebSocket();

  useEffect(() => {
    return subscribe((message: ServerEvent) => {
      console.log("Client", message);
      if (message.type === ServerEventType.JOINED_ROOM) {
        setIsConnectedToGameRoom(true);
      }
    });
  }, [subscribe, setIsConnectedToGameRoom]);

  const joinRoom = () => {
    // for now, pretend to join a room if there is no room code
    setGameMode(GameMode.BLANK);

    if (!roomCode) {
      setIsConnectedToGameRoom(true);
      disconnect();
      return;
    }

    send({
      action: ClientEventAction.JOIN_ROOM,
      roomCode,
      name,
      playerId,
    });
  };

  return (
    <WelcomePage>
      <Title>PMW Phone Client</Title>
      <ConnectionStatus />

      <input
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
        type="text"
        autoComplete="off"
        maxLength={4}
      />

      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
        type="text"
        autoComplete="off"
        maxLength={20}
      />

      <Button onClick={joinRoom} disabled={!connected}>
        Join Room
      </Button>
    </WelcomePage>
  );
};

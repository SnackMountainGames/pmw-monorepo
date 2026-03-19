import { ConnectionStatus, useSharedWebSocket } from "shared-component-library";
import { useEffect } from "react";
import { usePhoneClientStore } from "../state/PhoneClientStoreProvider";
import {
  ClientEventAction,
  ServerEvent,
  ServerEventType,
} from "shared-type-library";

export const WelcomeMenu = () => {
  const roomCode = usePhoneClientStore((state) => state.roomCode);
  const setRoomCode = usePhoneClientStore((state) => state.setRoomCode);
  const name = usePhoneClientStore((state) => state.name);
  const setName = usePhoneClientStore((state) => state.setName);
  const playerId = usePhoneClientStore((state) => state.playerId);
  const setIsConnectedToGameRoom = usePhoneClientStore(
    (state) => state.setIsConnectedToGameRoom,
  );

  const { connected, subscribe, send } = useSharedWebSocket();

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
    if (!roomCode) {
      setIsConnectedToGameRoom(true);
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
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 20,
      }}
    >
      <h1>PMW Phone Client</h1>
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

      <button onClick={joinRoom} disabled={!connected}>
        Join Room
      </button>
    </div>
  );
};

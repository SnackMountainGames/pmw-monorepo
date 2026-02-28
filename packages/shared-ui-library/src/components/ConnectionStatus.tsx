import { useEffect, useRef, useState } from 'react';
import {
  ServerMessage,
  ServerMessageAction,
  useSharedWebSocket,
} from 'shared-network-library';

export const ConnectionStatus = () => {
  console.log("Hellow from connection status");
  const { connected, subscribe } = useSharedWebSocket();
  const [showHeartbeat, setShowHeartbeat] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("connection status useEffect");
    const unsubscribe = subscribe((message: ServerMessage) => {
      if (message.type === ServerMessageAction.HEARTBEAT) {
        setShowHeartbeat(true);

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
          setShowHeartbeat(false);
        }, 5000);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return (
    <p>
      Status:{' '}
      <strong style={{ color: connected ? 'green' : 'red' }}>
        {connected ? 'Connected' : 'Disconnected'}
      </strong>
      <span
        style={{
          marginLeft: 4,
          opacity: showHeartbeat ? 1 : 0.1,
          transition: 'opacity 1s ease-out',
        }}
      >
        ❤️
      </span>
    </p>
  );
};

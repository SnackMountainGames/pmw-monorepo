import { useEffect, useRef, useState } from 'react';
import { useSharedWebSocket } from '../providers/WebSocketProvider';
import { ServerEvent, ServerEventType } from 'shared-type-library';

export const ConnectionStatus = () => {
  const { connected, subscribe } = useSharedWebSocket();
  const [showHeartbeat, setShowHeartbeat] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return subscribe((message: ServerEvent) => {
      if (message.type === ServerEventType.HEARTBEAT) {
        setShowHeartbeat(true);

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
          setShowHeartbeat(false);
        }, 5000);
      }
    });
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

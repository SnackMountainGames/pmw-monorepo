import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  ClientEvent,
  ClientEventAction,
  ServerEvent,
  ServerEventListener,
} from "shared-type-library";

type WebSocketContextType = {
  connected: boolean;
  send: (data: ClientEvent) => void;
  subscribe: (listener: ServerEventListener) => () => void;
  disconnect: () => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
const WEBSOCKET_URL =
  "wss://6dwbd9e1d8.execute-api.us-west-2.amazonaws.com/dev/";

const HEARTBEAT_ENABLED = false;

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<ServerEventListener[]>([]);
  const heartbeatRef = useRef<number | null>(null);

  const [connected, setConnected] = useState(false);

  /**
   * Send function (stable reference)
   */
  const send = useCallback((data: ClientEvent) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not open. Cannot send message.", {data});
    }
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    if (HEARTBEAT_ENABLED) {
      heartbeatRef.current = window.setInterval(() => {
        send({ action: ClientEventAction.HEARTBEAT });
      }, 60000);
    }
  }, [send, stopHeartbeat]);

  /**
   * Establish connection once
   */
  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      startHeartbeat();
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      setConnected(false);
      stopHeartbeat();
      console.log("WebSocket disconnected");
    };

    socket.onerror = () => {
      setConnected(false);
      stopHeartbeat();
      console.error("WebSocket error");
    };

    socket.onmessage = (event) => {
      try {
        const message: ServerEvent = JSON.parse(event.data);

        // Broadcast to all subscribers
        listenersRef.current.forEach((listener) => {
          listener(message);
        });
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    return () => {
      socket.close();
      stopHeartbeat();
    };
  }, []);

  /**
   * Subscribe to incoming messages
   * Returns unsubscribe function
   */
  const subscribe = useCallback((listener: ServerEventListener) => {
    listenersRef.current.push(listener);

    return () => {
      listenersRef.current = listenersRef.current.filter((l) => l !== listener);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ connected, send, subscribe, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

/**
 * Hook to consume the shared socket
 */
export const useSharedWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useSharedWebSocket must be used inside a WebSocketProvider",
    );
  }
  return context;
};

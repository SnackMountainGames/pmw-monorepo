import { ConnectionStatus, WebSocketProvider } from 'shared-component-library';

export function App() {
  return (
    <WebSocketProvider>
      <h1>PMW Phone Client</h1>
      <ConnectionStatus />
    </WebSocketProvider>
  );
}
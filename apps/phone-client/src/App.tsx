import { ConnectionStatus } from 'shared-ui-library';
import { WebSocketProvider } from 'shared-network-library';

export function App() {
  console.log("HOw many APPs are there?")
  return (
    <WebSocketProvider>
      <h1>PMW Phone Client</h1>
      <ConnectionStatus />
    </WebSocketProvider>
  );
}
import { PhoneClientStoreProvider } from './state/PhoneClientStoreProvider';
import { WebSocketProvider } from 'shared-component-library';
import { Router } from './components/Router';

export type PhoneClientAppsOptionalProps = {
  roomCode?: string;
  name?: string;
}

export const PhoneClientApp = (optionalProps: PhoneClientAppsOptionalProps) => {
  const { roomCode, name } = optionalProps;

  return (
    <WebSocketProvider>
      <PhoneClientStoreProvider roomCode={roomCode} name={name}>
        <Router />
      </PhoneClientStoreProvider>
    </WebSocketProvider>
  );
}
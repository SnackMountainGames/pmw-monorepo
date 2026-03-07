import { PhoneClientStoreProvider } from './state/PhoneClientStoreProvider';
import { WebSocketProvider } from 'shared-component-library';
import { Router } from './components/Router';

export const PhoneClientApp = () => {
  return (
    <WebSocketProvider>
      <PhoneClientStoreProvider>
        <Router />
      </PhoneClientStoreProvider>
    </WebSocketProvider>
  );
}
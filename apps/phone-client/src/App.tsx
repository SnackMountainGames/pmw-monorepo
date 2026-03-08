import { PhoneClientStoreProvider } from './state/PhoneClientStoreProvider';
import { WebSocketProvider } from 'shared-component-library';
import { Router } from './components/Router';
import { GameCanvasControls } from './types/types';
import { Ref } from 'react';

export type PhoneClientAppsOptionalProps = {
  roomCode?: string;
  name?: string;
  ref?: Ref<GameCanvasControls>;
}

export const PhoneClientApp = (optionalProps: PhoneClientAppsOptionalProps) => {
  const { roomCode, name, ref } = optionalProps;

  return (
    <WebSocketProvider>
      <PhoneClientStoreProvider roomCode={roomCode} name={name} ref={ref}>
        <Router />
      </PhoneClientStoreProvider>
    </WebSocketProvider>
  );
}
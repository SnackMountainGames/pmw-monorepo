import styled from '@emotion/styled';
import { PhoneClientApp } from 'phone-client';
import { useRef } from 'react';
import { GameCanvasControls } from 'phone-client';
import { useGameSimulationStore } from './state/GameSimulationState';
import { PhoneClientSection } from './components/PhoneClientSection';
import { GameHostSection } from './components/GameHostSection';
import { WebSocketProvider } from 'shared-component-library';

const FAKE_PHONE_SCALE = 0.6;

const FakePhone = styled.div`
  margin: 20px;
  height: ${750 * FAKE_PHONE_SCALE}px;
  width: ${360 * FAKE_PHONE_SCALE}px;
  border: 3px solid black;
  border-radius: 30px;
`;

export const GameCommandCenterApp = () => {
  const { phoneClients, setPhoneClients } = useGameSimulationStore();
  const phoneClientControlRefs = useRef<GameCanvasControls[]>([]);

  const { roomCode } = useGameSimulationStore();

  const addPhone = () => {
    setPhoneClients([
      ...phoneClients,
      <FakePhone key={Date.now()}>
        <PhoneClientApp
          roomCode={roomCode}
          name={`Player ${phoneClients.length + 1}`}
          ref={(el) => {
            if (el) phoneClientControlRefs.current[phoneClients.length] = el;
          }}
        />
      </FakePhone>,
    ]);
  };

  return (
    <>
      <div>
        <span>Game Command Center</span>
        <button onClick={addPhone}>Add phone client</button>
        <button
          onClick={() => {
            phoneClientControlRefs.current[0].pointerDown(50, 50);
            phoneClientControlRefs.current[0].pointerUp(50, 50);
            phoneClientControlRefs.current[1].pointerDown(100, 50);
            phoneClientControlRefs.current[1].pointerUp(160, 50);
          }}
        >
          Simulate button click
        </button>
      </div>
      <div style={{ display: 'flex' }}>
        <WebSocketProvider>
          <GameHostSection />
        </WebSocketProvider>
        <PhoneClientSection />
      </div>
    </>
  );
}
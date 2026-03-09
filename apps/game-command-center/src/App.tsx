import styled from '@emotion/styled';
import { PhoneClientApp } from 'phone-client';
import { ReactNode, useRef, useState } from 'react';
import { GameCanvasControls } from 'phone-client';
import { useGameSimulationStore } from './state/GameSimulationState';

const PhoneClientContainer = styled.div`
  margin: 20px;
  height: 750px;
  width: 360px;
  border: 3px solid black;
  border-radius: 30px;
`;

export const GameCommandCenterApp = () => {
  const [phoneClients, setPhoneClients] = useState<ReactNode[]>([]);
  const phoneClientControlRefs = useRef<GameCanvasControls[]>([]);

  const { roomCode } = useGameSimulationStore();

  const addPhone = () => {
    setPhoneClients((prev) => [
      ...prev,
      <PhoneClientContainer key={Date.now()}>
        <PhoneClientApp
          roomCode={roomCode}
          name={`Player ${phoneClients.length + 1}`}
          ref={(el) => {
            if (el) phoneClientControlRefs.current[phoneClients.length] = el;
          }}
        />
      </PhoneClientContainer>,
    ]);
  };

  return (
    <>
      <div>
        <span>Game Command Center</span>
        <button
          onClick={addPhone}
        >
          Add phone client
        </button>
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
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {phoneClients.map((phoneClient) => phoneClient)}
      </div>
    </>
  );
}
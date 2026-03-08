import styled from '@emotion/styled';
import { PhoneClientApp } from 'phone-client';
import { ReactNode, useRef, useState } from 'react';
import { GameCanvasControls } from 'phone-client';

const PhoneClientContainer = styled.div`
  margin: 50px;
  height: 750px;
  width: 360px;
  border: 3px solid black;
  border-radius: 30px;
`;

// const PhoneClientContainerSmall = styled.div`
//   margin: 50px;
//   height: 650px;
//   width: 312px;
//   border: 3px solid black;
//   border-radius: 30px;
// `;

export const GameCommandCenterApp = () => {
  const [phoneClients, setPhoneClients] = useState<ReactNode[]>([]);
  const phoneClientRefs = useRef<GameCanvasControls[]>([]);

  const addPhone = () => {
    setPhoneClients((prev) => [
      ...prev,
      <PhoneClientContainer>
        <PhoneClientApp
          roomCode="KVVA"
          ref={(el) => {
            if (el) phoneClientRefs.current[0] = el;
          }}
        />
      </PhoneClientContainer>,
    ]);
  };

  return (
    <>
      <div style={{ position: 'absolute' }}>
        <span>Game Command Center</span>
        <button
          onClick={addPhone}
        >
          Add phone client
        </button>
        <button
          onClick={() => phoneClientRefs.current[0].pointerDown(50, 60)}
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
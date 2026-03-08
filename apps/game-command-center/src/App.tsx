import styled from '@emotion/styled';
import { PhoneClientApp } from 'phone-client';
import { ReactNode, useState } from 'react';

const PhoneClientContainer = styled.div`
  margin: 50px;
  height: 750px;
  width: 360px;
  border: 3px solid black;
  border-radius: 30px;
`;

const PhoneClientContainerSmall = styled.div`
  margin: 50px;
  height: 650px;
  width: 312px;
  border: 3px solid black;
  border-radius: 30px;
`;

export const GameCommandCenterApp = () => {
  const [phoneClients, setPhoneClients] = useState<ReactNode[]>([]);

  return (
    <>
      <div style={{ position: 'absolute' }}>
        <span>Game Command Center</span>
        <button
          onClick={() =>
            setPhoneClients([
              ...phoneClients,
              <PhoneClientContainer>
                <PhoneClientApp roomCode="KVVA" />
              </PhoneClientContainer>,
            ])
          }
        >
          Add large
        </button>
        <button
          onClick={() =>
            setPhoneClients([
              ...phoneClients,
              <PhoneClientContainerSmall>
                <PhoneClientApp name="K2" />
              </PhoneClientContainerSmall>,
            ])
          }
        >
          Add small
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {phoneClients.map((phoneClient) => phoneClient)}
      </div>
    </>
  );
}
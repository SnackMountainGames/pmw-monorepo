import styled from '@emotion/styled';
import { PhoneClientApp } from 'phone-client';

export function GameCommandCenterApp() {

  const PhoneClientContainer = styled.div`
    margin: 50px;
    height: 750px;
    width: 360px;
    border: 3px solid black;
    border-radius: 30px;
  `;

  return (
    <>
      <div style={{ position: 'absolute' }}>Game Command Center</div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <PhoneClientContainer>
          <PhoneClientApp />
        </PhoneClientContainer>

        <PhoneClientContainer>
          <PhoneClientApp />
        </PhoneClientContainer>
      </div>
    </>
  );
}
import styled from '@emotion/styled';
import { usePhoneClientStore } from '../../state/PhoneClientStoreProvider';

export const TOP_HUD_HEIGHT = 60;
export const BOTTOM_HUD_HEIGHT = 60;

const TopHud = styled.div`
  height: ${TOP_HUD_HEIGHT}px;
  box-sizing: border-box;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HudButton = styled.button`
  background: none;
  border: none;
  pointer-events: all;
  height: ${TOP_HUD_HEIGHT}px;
  width: ${TOP_HUD_HEIGHT}px;
`;

export const Hud = () => {
  const roomCode = usePhoneClientStore((state) => state.roomCode);
  const name = usePhoneClientStore((state) => state.name);

  return (
    <TopHud id="game-hud">
      <div>
        <HudButton onClick={() => console.log('HUD Button Left')}>Menu</HudButton>
      </div>
      <div>
        {roomCode ? (
          <span>
            Successfully joined room {roomCode} as {name} 🎉
          </span>
        ) : (
          <span>⚠ Not actually in a room (testing) ⚠</span>
        )}
      </div>
      <div>
        {/*<HudButton onClick={() => console.log('HUD Button Right')}>R</HudButton>*/}
      </div>
    </TopHud>
  );
}
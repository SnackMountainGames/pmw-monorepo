import styled from "@emotion/styled";
import { useState } from "react";
import { PhoneClientSection } from "./components/PhoneClientSection";
import { GameHostSection } from "./components/GameHostSection";
import { WebSocketProvider } from "shared-component-library";
import "./styles.css";

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  
  button {
    margin-right: 8px;
  }
`;

const ToggleAndLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
  
  label {
    margin-right: 4px;
  }
`;

export const GameCommandCenterApp = () => {
  const [showGameHostSection, setShowGameHostSection] = useState<boolean>(false);

  return (
    <>
      <h1>Game Command Center</h1>
      <ButtonBar>
        <ToggleAndLabel>
          <label className="toggle">
            <input
              type="checkbox"
              id="btnToggle"
              name="btnToggle"
              onClick={() => setShowGameHostSection(!showGameHostSection)}
            />
            <span className="slider"></span>
          </label>
          <span>Enable Game Host</span>
        </ToggleAndLabel>
      </ButtonBar>
      <div style={{ display: "flex" }}>
        {showGameHostSection && (
          <WebSocketProvider>
            <GameHostSection />
          </WebSocketProvider>
        )}
        <PhoneClientSection />
      </div>
    </>
  );
};

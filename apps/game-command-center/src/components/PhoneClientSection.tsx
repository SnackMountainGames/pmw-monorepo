import { useGameSimulationStore } from "../state/GameSimulationState";
import styled from "@emotion/styled";
import { PhoneClientApp } from "phone-client/dist";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 20px 15px 20px;
  border: 2px solid grey;
  border-radius: 10px;
  margin: 20px 0;
  width: fit-content;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const PhoneClient = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px dashed black;
  margin: 0 5px 5px 0;
  padding: 20px;

  :nth-last-child(1) {
    margin-right: 0;
  }
`;

const PhoneClientControls = styled.div`
  margin-bottom: 5px;
`;

const Title = styled.div`
  font-size: 14px;
  font-family: "Cascadia Code",monospace;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
`;

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
`;

const SectionButtonBar = styled(ButtonBar)`
  margin-bottom: 20px;
  justify-content: normal;

  button {
    margin-right: 8px;

    :nth-last-child(1) {
      margin-right: 0;
    }
  }
`;

const ButtonIcon = styled.span`
  height: 23px;
  display: flex;
  align-items: center;
  margin-bottom: 1px;
`;

const FAKE_PHONE_SCALE = 0.6;
const FakePhone = styled.div`
  height: ${750 * FAKE_PHONE_SCALE}px;
  width: ${360 * FAKE_PHONE_SCALE}px;
  border: 3px solid black;
  border-radius: 30px;
`;

export const PhoneClientSection = () => {
  const { roomCode, phoneClientMap, setPhoneClientMap, phoneClientRefMap } = useGameSimulationStore();

  const removePhone = (playerId: string) => {
    phoneClientMap.delete(playerId);
    setPhoneClientMap(phoneClientMap);
  };

  const addPhone = () => {
    const playerId = `fake-player-${Math.floor(Math.random() * 10000)}`;

    phoneClientMap.set(
      playerId,
      <PhoneClientApp
        roomCode={roomCode}
        name={`Player ${(phoneClientMap.size + 1).toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}`}
        playerId={playerId}
        ref={(el) => {
          if (el) phoneClientRefMap.set(playerId, el);
        }}
      />,
    );

    setPhoneClientMap(phoneClientMap);
  };

  const removeAllPhones = () => {
    setPhoneClientMap(new Map());
  };

  const simulateButtonClick = (length: number) => {
    phoneClientRefMap.forEach(async (ref) => {
      ref.pointerDown(150, 150);
      await new Promise((resolve) => setTimeout(resolve, length));
      ref.pointerUp(150, 150);
    });
  }

  return (
    <Section>
      <h2>Phone Clients</h2>
      <SectionButtonBar>
        <button onClick={addPhone}>Add Phone</button>
        <button onClick={removeAllPhones}>Remove All</button>
        <button onClick={() => simulateButtonClick(150)}>Simulate button click</button>
        <button onClick={() => simulateButtonClick(1000)}>Simulate button hold</button>
      </SectionButtonBar>
      <Container>
        {Array.from(phoneClientMap.entries()).map((client) => (
          <PhoneClient key={client[0]}>
            <PhoneClientControls>
              <ButtonBar>
                <Title>
                  <span>Player Id:</span>
                  <span>{client[0]}</span>
                </Title>
                <button onClick={() => removePhone(client[0])}>
                  <ButtonIcon role="img" aria-label="delete phone client">
                    ❌
                  </ButtonIcon>
                </button>
              </ButtonBar>
            </PhoneClientControls>
            <FakePhone>{client[1]}</FakePhone>
          </PhoneClient>
        ))}
      </Container>
    </Section>
  );
};

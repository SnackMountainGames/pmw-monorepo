import { useGameSimulationStore } from "../state/GameSimulationState";
import styled from "@emotion/styled";
import { useState } from "react";
import {
  buildTasks,
  SIMULATION_TIME,
  SimulationOption,
} from "../simulation/Simulation";
import { PhoneClientApp } from "phone-client";

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

const SimulationSection = styled.div`
  font-size: 14px;
  font-family: "Cascadia Code", monospace;
  display: flex;
  flex-direction: row;
  align-items: center;
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

const FAKE_PHONE_SCALE = 0.8;
const FakePhone = styled.div`
  height: ${750 * FAKE_PHONE_SCALE}px;
  width: ${360 * FAKE_PHONE_SCALE}px;
  border: 3px solid black;
  border-radius: 30px;
  overflow: hidden;
  background-color: black;
  margin-bottom: 5px;
`;

export const PhoneClientSection = () => {
  const { roomCode, phoneClientMap, setPhoneClientMap, phoneClientRefMap } = useGameSimulationStore();

  const [ selectedOptionsMap, setSelectedOptionsMap ] = useState<Map<string, SimulationOption>>(new Map());
  const [ simulationRunning, setSimulationRunning ] = useState<boolean>(false);

  const removePhone = (playerId: string) => {
    phoneClientMap.delete(playerId);
    setPhoneClientMap(phoneClientMap);
    phoneClientRefMap.delete(playerId);
    selectedOptionsMap.delete(playerId);
    setSelectedOptionsMap(selectedOptionsMap);
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
        debug
      />,
    );

    setPhoneClientMap(phoneClientMap);
    setSelectedOptionsMap((prev) =>
      new Map(prev).set(playerId, SimulationOption.None),
    );
  };

  const removeAllPhones = () => {
    setPhoneClientMap(new Map());
    setSelectedOptionsMap(new Map());
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      setSimulationRunning(false);
    }, SIMULATION_TIME);

    phoneClientMap.forEach(async (_, key) => {
      const selectedOption = selectedOptionsMap.get(key);
      const phoneClientRef = phoneClientRefMap.get(key);

      if (!selectedOption || !phoneClientRef) return;

      const tasks = buildTasks(selectedOption, phoneClientRef);

      for (const task of tasks) {
        await task();
      }
    });
  }

  return (
    <Section>
      <h2>Phone Clients</h2>
      <SectionButtonBar>
        <button onClick={addPhone}>Add Phone</button>
        <button onClick={removeAllPhones}>Remove All</button>
        <button onClick={runSimulation} disabled={simulationRunning}>
          Simulate
        </button>
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
                  <ButtonIcon>
                    <span role="img" aria-label="delete phone client">
                      ❌
                    </span>
                  </ButtonIcon>
                </button>
              </ButtonBar>
            </PhoneClientControls>
            <FakePhone>{client[1]}</FakePhone>
            <SimulationSection>
              <span>Simulation:&nbsp;</span>
              <select
                value={selectedOptionsMap.get(client[0])}
                onChange={(e) => {
                  setSelectedOptionsMap((prev) =>
                    new Map(prev).set(client[0], Number(e.target.value)),
                  );
                }}
              >
                <option value={SimulationOption.None}>No Simulation</option>
                <option value={SimulationOption.ShortTaps}>Fast Taps</option>
                <option value={SimulationOption.MediumTaps}>Medium Taps</option>
                <option value={SimulationOption.LongTaps}>Slow Taps</option>
              </select>
            </SimulationSection>
          </PhoneClient>
        ))}
      </Container>
    </Section>
  );
};

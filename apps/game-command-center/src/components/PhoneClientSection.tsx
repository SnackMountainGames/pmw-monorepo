import { useGameSimulationStore } from '../state/GameSimulationState';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
  border: 2px solid grey;
  border-radius: 10px;
  margin: 20px;
`;

export const PhoneClientSection = () => {
  const { phoneClients } = useGameSimulationStore();

  return (
    <Container>
      {phoneClients.map((phoneClient) => phoneClient)}
    </Container
     >
  );
}
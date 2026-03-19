import { usePhoneClientStore } from "../state/PhoneClientStoreProvider";
import { WelcomeMenu } from "./WelcomeMenu";
import { Hud } from "./hud/Hud";
import { GameCanvas } from "./canvas/GameCanvas";

export const Router = () => {
  const isConnectedToGameRoom = usePhoneClientStore(
    (state) => state.isConnectedToGameRoom,
  );
  const ref = usePhoneClientStore((state) => state.ref);

  if (!isConnectedToGameRoom) {
    return <WelcomeMenu />;
  }

  return (
    <>
      <Hud />
      <GameCanvas ref={ref} />
    </>
  );
};

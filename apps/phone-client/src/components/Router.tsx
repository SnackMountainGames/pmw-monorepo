import { usePhoneClientStore } from "../state/PhoneClientStoreProvider";
import { WelcomeMenu } from "./WelcomeMenu";
import { BottomHud, TopHud } from "./hud/Hud";
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
      <TopHud />
      <GameCanvas ref={ref} />
      <BottomHud />
    </>
  );
};

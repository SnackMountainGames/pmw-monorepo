import { usePhoneClientStore } from "../state/PhoneClientStoreProvider";
import { WelcomeMenu } from "./WelcomeMenu";
import { BottomHud, TopHud } from "./hud/Hud";
import { GameCanvas } from "./canvas/GameCanvas";
import { useSharedWebSocket } from "shared-component-library";
import { useEffect } from "react";
import { ServerEvent, ServerEventType } from "shared-type-library";
import {
  FIVE_MINUTES,
  LocalStorageKeys,
} from "../utilities/LocalStorageUtilities";

export const Router = () => {
  const isConnectedToGameRoom = usePhoneClientStore(
    (state) => state.isConnectedToGameRoom,
  );
  const ref = usePhoneClientStore((state) => state.ref);

  const { subscribe } = useSharedWebSocket();

  useEffect(() => {
    return subscribe((message: ServerEvent) => {
      if (message.type === ServerEventType.HEARTBEAT && isConnectedToGameRoom) {
        localStorage.setItem(LocalStorageKeys.ROOM_CODE_EXPIRATION, (Date.now() + FIVE_MINUTES).toString());
      }
    });
  }, [subscribe, isConnectedToGameRoom]);

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

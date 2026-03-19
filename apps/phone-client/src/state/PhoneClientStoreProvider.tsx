// PhoneStoreProvider.tsx
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createPhoneClientStore } from "./GameState";
import { PhoneClientAppsOptionalProps } from "../App";

const PhoneClientStoreContext = createContext<ReturnType<
  typeof createPhoneClientStore
> | null>(null);

export type PhoneClientStoreProviderProps = {
  children: ReactNode;
} & PhoneClientAppsOptionalProps;

export const PhoneClientStoreProvider = (
  props: PhoneClientStoreProviderProps,
) => {
  const { children, roomCode, name, playerId, ref } = props;

  console.log("create thingy", playerId);

  const storeRef = useRef<ReturnType<typeof createPhoneClientStore>>(
    createPhoneClientStore({ roomCode, name, playerId, ref }),
  );

  return (
    <PhoneClientStoreContext.Provider value={storeRef.current}>
      {children}
    </PhoneClientStoreContext.Provider>
  );
};

export function usePhoneClientStore<T>(selector: (state: any) => T) {
  const store = useContext(PhoneClientStoreContext);

  if (!store) {
    throw new Error(
      "usePhoneClientStore must be used inside PhoneClientStoreProvider",
    );
  }

  return useStore(store, selector);
}

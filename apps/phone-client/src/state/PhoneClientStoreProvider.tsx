// PhoneStoreProvider.tsx
import { createContext, ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createPhoneClientStore } from './GameState';

const PhoneClientStoreContext = createContext<ReturnType<
  typeof createPhoneClientStore
> | null>(null);

export const PhoneClientStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef =
    useRef<ReturnType<typeof createPhoneClientStore>>(createPhoneClientStore());

  if (!storeRef.current) {
    storeRef.current = createPhoneClientStore();
  }

  return (
    <PhoneClientStoreContext.Provider value={storeRef.current}>
      {children}
    </PhoneClientStoreContext.Provider>
  );
}

export function usePhoneClientStore<T>(selector: (state: any) => T) {
  const store = useContext(PhoneClientStoreContext);

  if (!store) {
    throw new Error('usePhoneClientStore must be used inside PhoneClientStoreProvider');
  }

  return useStore(store, selector);
}

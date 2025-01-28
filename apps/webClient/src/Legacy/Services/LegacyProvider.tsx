'use client';
import { MainStore } from '../Hooks/ContextStore';
import useCategories from '../Hooks/UseCategories';
import useWallets from '../Hooks/UseWallets';
import { ReactElement, ReactNode } from 'react';

export const LegacyProvider = ({ children }: { children: ReactNode }): ReactElement => {
  // Hooks
  const [categories, dispatchCategories] = useCategories();
  const [wallets, dispatchWallets] = useWallets();

  return (
    <MainStore.Provider
      value={{
        categories,
        dispatchCategories,
        wallets,
        dispatchWallets,
      }}
    >
      {children}
    </MainStore.Provider>
  );
};

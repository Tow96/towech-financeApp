'use client';
import { MainStore } from './Hooks/ContextStore';
import useToken from './Hooks/UseToken';
import useCategories from './Hooks/UseCategories';
import useWallets from './Hooks/UseWallets';

export const LegacyProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  // Hooks
  const [authToken, dispatchAuthToken] = useToken();
  const [categories, dispatchCategories] = useCategories();
  const [wallets, dispatchWallets] = useWallets();

  return (
    <MainStore.Provider
      value={{
        authToken,
        dispatchAuthToken,
        categories,
        dispatchCategories,
        wallets,
        dispatchWallets,
      }}>
      {children}
    </MainStore.Provider>
  );
};

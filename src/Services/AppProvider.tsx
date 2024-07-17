'use client';
import { MainStore } from '../Hooks/ContextStore';
import useToken from '../Hooks/UseToken';
import useCategories from '../Hooks/UseCategories';
import useWallets from '../Hooks/UseWallets';
import AuthenticationService from './AuthenticationService';
import { useEffect } from 'react';

export const AppProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  // Declares the service
  const authService = new AuthenticationService();

  // Hooks
  const [authToken, dispatchAuthToken] = useToken();
  const [categories, dispatchCategories] = useCategories();
  const [wallets, dispatchWallets] = useWallets();

  // use Effect for first load
  useEffect(() => {
    authService
      .refreshToken()
      .then((res) => {
        // The keep session is ignored for this call
        dispatchAuthToken({ type: 'LOGIN', payload: res.data });
      })
      .catch(() => {
        dispatchAuthToken({ type: 'LOGOUT', payload: { token: '' } });
      });
  }, []);

  return (
    <MainStore.Provider
      value={{
        authToken,
        dispatchAuthToken,
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

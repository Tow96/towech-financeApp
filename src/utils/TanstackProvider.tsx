'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { useState } from 'react';

// Client ---------------------------------------------------------------------
export enum keys {
  USERKEY = 'token',
}

// TODO: Move this into useState if disconnects are happening
const queryClient = new QueryClient();
queryClient.setQueryDefaults([keys.USERKEY], { retry: 0 });

// Wrapper --------------------------------------------------------------------
// TODO: Hide the DevTools on production build
const TanstackProvider = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default TanstackProvider;

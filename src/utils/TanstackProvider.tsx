'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { useState } from 'react';

// Client ---------------------------------------------------------------------
export enum keys {
  USERKEY = 'user',
}

// Move this into useState if disconnects are happening
const queryClient = new QueryClient();
queryClient.setQueryDefaults([keys.USERKEY], { retry: 0 });

// Wrapper --------------------------------------------------------------------
const TanstackProvider = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    {children}
    {process.env.NEXT_PUBLIC_DEBUG === 'True' && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);

export default TanstackProvider;

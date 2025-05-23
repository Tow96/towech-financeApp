'use client';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Client ---------------------------------------------------------------------
export enum TanstackKeys {
  AUTH = 'auth',
}

// Move this into useState if disconnects are happening
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 30 } } });

// Wrapper --------------------------------------------------------------------
const TanstackProvider = ({ children }: { children: ReactNode }): ReactElement => (
  <QueryClientProvider client={queryClient}>
    {children}
    {process.env.NEXT_PUBLIC_DEBUG === 'True' && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);

export { TanstackProvider };

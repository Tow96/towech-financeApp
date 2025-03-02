/** Toast.Provider.tsx
 * Copyright (c) 2023, TowechLabs
 *
 * Provider that handles toast display
 */
'use client';
import { ToastComponent } from './Toast.Component';
import { useToasts } from './Toast.Service';
import { ReactElement, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: Props): ReactElement => {
  const toasts = useToasts();

  return (
    <>
      <div className="absolute right-0 top-0 z-50 m-8 flex w-44 flex-col overflow-x-hidden">
        {toasts.map((t) => (
          <ToastComponent key={t.id} toast={t} />
        ))}
      </div>
      {children}
    </>
  );
};

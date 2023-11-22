/** ToastProvider.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Provider that handles toast display
 */
'use client';
import { ToastComponent } from './Toast';
import { useToasts } from './ToastService';

type Props = {
  children: React.ReactNode;
};

export const ToastProvider = ({ children }: Props): JSX.Element => {
  const toasts = useToasts();

  return (
    <>
      <div className="absolute right-0 top-0 z-50 m-8 flex w-44 flex-col overflow-x-hidden">
        {toasts.map(t => (
          <ToastComponent key={t.id} toast={t} />
        ))}
      </div>
      {children}
    </>
  );
};

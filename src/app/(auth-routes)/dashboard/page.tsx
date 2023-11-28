/** dashboard/page.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Dashboard Page, will display transactions
 */
'use client';
import { useAddToast } from '@/libs/feature-toasts/ToastService';

const DashboardPage = (): JSX.Element => {
  const addToast = useAddToast();

  const displayAllTypes = () => {
    addToast({ message: 'warning', type: 'warning' });
    addToast({ message: 'info', type: 'info' });
    addToast({ message: 'success', type: 'success' });
    addToast({ message: 'error', type: 'error' });
  };
  return (
    <main>
      DASHBOARD
      <button onClick={displayAllTypes}>TOSTON</button>
    </main>
  );
};

export default DashboardPage;

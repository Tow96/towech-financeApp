/** settings/security/pages.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Page that handles the forms for editing the security settings
 */
'use client';
// Libraries ------------------------------------------------------------------
import { usePasswordReset, useGlobalLogout } from '@/libs/feature-authentication/UserService';
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { useAddToast } from '@/libs/feature-toasts/ToastService';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
// Used components ------------------------------------------------------------
import { Button } from '@/components/button';
import { Modal } from '@/components/modal';
import { ChangePasswordForm } from '@/libs/feature-settings/ChangePasswordForm';

// Types ----------------------------------------------------------------------

// Component ------------------------------------------------------------------
const SecuritySettingsPage = (): JSX.Element => {
  const addToast = useAddToast();

  // Pasword Reset ------------------------------
  const resetPass = usePasswordReset();
  useEffect(() => {
    if (resetPass.status === 'success') addToast({ message: 'Email sent', type: 'success' });
    if (resetPass.status === 'error')
      addToast({ message: resetPass.error?.message || 'Error', type: 'error' });
  }, [addToast, resetPass.status, resetPass.error?.message]);

  // Global logout ------------------------------
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const gLogout = useGlobalLogout();
  const openLogoutModal = () => {
    const nuParams = new URLSearchParams(params);
    nuParams.append('show-logout', 'y');
    router.replace(`${path}?${nuParams.toString()}`);
  };
  const executeGlobalLogout = () => {
    gLogout.mutate();
    redirect('/login');
  };

  // Render -------------------------------------
  return (
    <main>
      <ChangePasswordForm />
      <div className="my-3 block border-b-2 border-riverbed-900" />
      <section data-testid="reset-form">
        <h2>Forgotten Password</h2>
        <Button onClick={() => resetPass.mutate()}>Send reset email</Button>
      </section>
      <section data-testid="logout-form">
        <h2>Logout from all devices</h2>
        <Button onClick={() => openLogoutModal()}>Logout</Button>
        <Modal
          title="Logout from all devices"
          onOk={() => executeGlobalLogout()}
          param="show-logout">
          This will remove all authentication from all devices. Are you sure?
        </Modal>
      </section>
    </main>
  );
};

export default SecuritySettingsPage;

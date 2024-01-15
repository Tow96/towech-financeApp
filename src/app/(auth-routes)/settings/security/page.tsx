/** settings/security/pages.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Page that handles the forms for editing the security settings
 */
'use client';
// Libraries ------------------------------------------------------------------
import {
  ChangePassword,
  usePasswordChange,
  usePasswordReset,
  useGlobalLogout,
} from '@/libs/feature-authentication/UserService';
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAddToast } from '@/libs/feature-toasts/ToastService';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
// Used components ------------------------------------------------------------
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Spinner } from '@/components/spinner';
import { Modal } from '@/components/modal';

// Types ----------------------------------------------------------------------

// Component ------------------------------------------------------------------
const SecuritySettingsPage = (): JSX.Element => {
  const addToast = useAddToast();

  // Password Form ------------------------------
  const changePass = usePasswordChange();
  const changePassForm = useForm<ChangePassword>();
  const onChangePassSubmit: SubmitHandler<ChangePassword> = data => changePass.mutate(data);
  useEffect(() => {
    if (changePass.status === 'success') {
      addToast({ message: 'Password updated', type: 'success' });
      changePassForm.reset();
    }
    if (changePass.status === 'error')
      addToast({ message: changePass.error?.message || 'Error', type: 'error' });
  }, [addToast, changePassForm, changePass.status, changePass.error?.message]);

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
      <section data-testid="pass-form">
        <h2>Change Password</h2>
        <form onSubmit={changePassForm.handleSubmit(onChangePassSubmit)}>
          <Input
            label="Old password"
            type="password"
            register={changePassForm.register('oldPassword', { required: true })}
          />
          <Input
            label="New password"
            type="password"
            register={changePassForm.register('newPassword', { required: true })}
          />
          <Input
            label="Confirm new password"
            type="password"
            register={changePassForm.register('confirmPassword', { required: true })}
          />
          <Button type="submit" disabled={!changePassForm.formState.isValid}>
            Save
          </Button>
        </form>
        {changePass.status === 'pending' && <Spinner />}
      </section>
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

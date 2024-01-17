/** LogoutAllForm.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Form that is used to logout from all sessions
 */
'use client';
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLogoutAll } from '@/libs/feature-authentication/UserService';

// Used components ------------------------------------------------------------
import { Button } from '@/components/button';
import { Modal } from '@/components/modal';

// Component ------------------------------------------------------------------
export const LogoutAllForm = (): JSX.Element => {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();

  const logout = useLogoutAll();

  const openLogoutModal = () => {
    const nuParams = new URLSearchParams(params);
    nuParams.append('show-logout', 'y');
    router.replace(`${path}?${nuParams.toString()}`);
  };
  useEffect(() => {
    if (logout.status === 'success') redirect('/login');
    if (logout.status === 'error') redirect('/login');
  }, [logout.status]);

  return (
    <section className="sm:flex">
      <h2 className="text-2xl">Logout from all devices</h2>
      <div className="flex flex-1 justify-end">
        <Button color="danger" onClick={() => openLogoutModal()}>
          Logout
        </Button>
      </div>
      <Modal
        color="danger"
        title="Logout from all devices"
        onOk={() => logout.mutate()}
        param="show-logout">
        This will remove all authentication from all devices. Are you sure?
      </Modal>
    </section>
  );
};

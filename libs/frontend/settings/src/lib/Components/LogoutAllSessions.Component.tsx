'use client';
import { ReactElement, useEffect } from 'react';
// Hooks
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLogoutAll } from '../User.Service';
import { useAuthentication, useLogout } from '@financeapp/frontend-authentication';
// Components
import { Button, Modal } from '@financeapp/frontend-common';

export const LogoutAllSessionsComponent = (): ReactElement => {
  const { data: user } = useAuthentication();
  const modalParam = 'show-logout';

  // Logout modal ---------------------------------------------------
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const openLogoutModal = () => {
    const nuParams = new URLSearchParams(params);
    nuParams.append(modalParam, 'y');
    router.replace(`${path}?${nuParams.toString()}`);
  };

  // Logout all sessions and remove current auth --------------------
  const logoutAll = useLogoutAll();
  const logout = useLogout();
  useEffect(() => {
    if (logoutAll.status === 'success' || logoutAll.status === 'error') {
      logout.mutate();
      redirect('/login');
    }
  }, [logoutAll.status, logout]);

  // Render ---------------------------------------------------------
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
        onOk={() => logoutAll.mutate(user?.userId || '')}
        param={modalParam}
      >
        This will remove all authentication from all devices, including this. Are you sure?
      </Modal>
    </section>
  );
};

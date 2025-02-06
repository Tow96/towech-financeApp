'use client';
import { ReactElement } from 'react';
// Components
import { Button, Modal } from '@financeapp/frontend-common';
import { useLogoutAllSessions } from './LogoutAllSessions.Hook';

export const LogoutAllSessionsButtonComponent = (): ReactElement => {
  const modalParam = 'show-logout';
  const logoutBttn = useLogoutAllSessions(modalParam);

  return (
    <section className="sm:flex">
      <h2 className="text-2xl">Logout from all devices</h2>
      <div className="flex flex-1 justify-end">
        <Button color="danger" onClick={() => logoutBttn.openModal()}>
          Logout
        </Button>
      </div>
      <Modal
        color="danger"
        title="Logout from all devices"
        onOk={() => logoutBttn.openModal}
        param={modalParam}
      >
        This will remove all authentication from all devices, including this. Are you sure?
      </Modal>
    </section>
  );
};

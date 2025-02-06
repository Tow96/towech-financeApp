'use client';
import { ReactElement } from 'react';
import { Button, Modal } from '@financeapp/frontend-common';
import { useDeleteUserButton } from './DeleteUserButton.Hook';

export const DeleteUserButtonComponent = (): ReactElement => {
  const modalParam = 'show-delete-user';
  const button = useDeleteUserButton(modalParam);

  // Render ---------------------------------------------------------
  return (
    <section className="flex gap-4 items-end mb-2 sm:mb-0">
      <h2 className="text-2xl flex-1">Delete user</h2>
      <Button
        text="Delete user"
        color="danger"
        disabled={button.isPending}
        loading={button.isPending}
        onClick={() => button.openModal()}
      />
      <Modal color="danger" title="Delete user" param={modalParam} onOk={() => button.delete()}>
        This will delete the user, along with all its information, this cannot be undone
      </Modal>
    </section>
  );
};

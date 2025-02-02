'use client';
import { ReactElement, useEffect } from 'react';
// Hooks
import { useDeleteUser, useUser } from '../User.Service';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
// Components
import { Button, Modal } from '@financeapp/frontend-common';
import { useLogout } from '@financeapp/frontend-authentication';

export const DeleteUserComponent = (): ReactElement => {
  const { data: user } = useUser();

  // Delete user modal ----------------------------------------------
  const modalParam = 'show-delete-user';
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const openDeleteUserModal = () => {
    const nuParams = new URLSearchParams(params);
    nuParams.append(modalParam, 'y');
    router.replace(`${path}?${nuParams.toString()}`);
  };

  // Delete user and remove current auth
  const deleteUser = useDeleteUser();
  const logout = useLogout();
  useEffect(() => {
    if (deleteUser.status === 'success') {
      logout.mutate();
      redirect('/login');
    }
  }, [deleteUser.status, logout]);

  // Render ---------------------------------------------------------
  return (
    <section className="flex gap-4 items-end mb-2 sm:mb-0">
      <h2 className="text-2xl flex-1">Delete user</h2>
      <Button
        color="danger"
        disabled={deleteUser.isPending}
        loading={deleteUser.isPending}
        onClick={() => openDeleteUserModal()}
      >
        Delete user
      </Button>
      <Modal
        color="danger"
        title="Delete user"
        param={modalParam}
        onOk={() => deleteUser.mutate(user?.id || '')}
      >
        This will delete the user, along with all its information, this cannot be undone
      </Modal>
    </section>
  );
};

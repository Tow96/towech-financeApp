import { useAuthentication, useLogout } from '@financeapp/frontend-authentication';
import { ApiContext } from '@financeapp/frontend-common';
import { useMutation } from '@tanstack/react-query';
import { TANSTACK_USER_KEY, useUser } from '../_Common/User.Hook';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const useDeleteUser = () => {
  const api = new ApiContext();
  const { data: auth } = useAuthentication();
  return useMutation({
    mutationKey: [TANSTACK_USER_KEY, 'delete password'],
    mutationFn: async (id: string) => {
      if (auth) await api.delete(`users/${id}`, auth.token);
    },
  });
};

export const useDeleteUserButton = (modalParam: string) => {
  const { data: user } = useUser();

  // Delete user modal ----------------------------------------------
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

  return {
    isPending: deleteUser.isPending,
    openModal: openDeleteUserModal,
    delete: () => deleteUser.mutate(user?.id || ''),
  };
};

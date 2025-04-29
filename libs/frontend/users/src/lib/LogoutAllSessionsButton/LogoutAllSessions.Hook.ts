// Hooks
import { useAuthentication, useLogout } from '@financeapp/frontend-authentication';
import { useMutation } from '@tanstack/react-query';
import { TANSTACK_USER_KEY } from '../_Common/User.Hook';
// Infrastructure
import { ApiContext } from '@financeapp/frontend-common';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const useLogoutAllCallback = () => {
  const api = new ApiContext();
  const { data: auth } = useAuthentication();

  return useMutation({
    mutationKey: [TANSTACK_USER_KEY, 'logout all sessions'],
    mutationFn: async (id: string) => {
      if (auth) await api.post(`logout-all/${id}`, auth.token);
    },
  });
};

export const useLogoutAllSessions = (modalParam: string) => {
  const { data: user } = useAuthentication();

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
  const logoutAll = useLogoutAllCallback();
  const logout = useLogout();
  useEffect(() => {
    if (logoutAll.status === 'success' || logoutAll.status === 'error') {
      logout.mutate();
      redirect('/login');
    }
  }, [logoutAll.status, logout]);

  return {
    isPending: logoutAll.isPending,
    openModal: openLogoutModal,
    logoutAll: () => logoutAll.mutate(user?.userId || ''),
  };
};

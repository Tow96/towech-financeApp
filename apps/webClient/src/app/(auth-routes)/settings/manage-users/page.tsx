'use client';
import { useAuthentication } from '@financeapp/frontend-authentication';
import { redirect } from 'next/navigation';
import { ReactElement } from 'react';

const ManageUsersPage = (): ReactElement => {
  // This page should only be accessible to admins
  const { data: auth } = useAuthentication();
  if (auth?.role !== 'admin') redirect('/dashboard');

  return <main>PAGE</main>;
};

export default ManageUsersPage;

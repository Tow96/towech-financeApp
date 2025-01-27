/** VerifyAccount.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Verify Account page
 */
'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Services
import UserService from '../../../Legacy/Services/UserService';

// Styles
import './VerifyAccount.css';

export default function VerifyPage(): JSX.Element {
  const userService = new UserService();
  const { verifyToken } = useParams<{ verifyToken: string }>();
  const router = useRouter();

  // Initial call, verifies the mail
  useEffect(() => {
    userService.verifyEmail(verifyToken).finally(() => {
      router.push('/home');
    });
  }, []);

  return <div className="VerifyAccount">Verfying</div>;
}

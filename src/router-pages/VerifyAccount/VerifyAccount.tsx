/** VerifyAccount.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Verify Account page
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Services
import UserService from '../../Services/UserService';

// Styles
import './VerifyAccount.css';

export default class VerifyAccount {
  static verifyPage = (): JSX.Element => {
    const userService = new UserService();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUrl = window.location.href.split('/');
    const token = currentUrl[currentUrl.length - 1];

    // Initial call, verifies the mail
    useEffect(() => {
      userService.verifyEmail(token).finally(() => {
        navigate(location.state ? (location.state as any).path : '/home');
      });
    }, []);

    return <div className="VerifyAccount">Verifying</div>;
  };
}

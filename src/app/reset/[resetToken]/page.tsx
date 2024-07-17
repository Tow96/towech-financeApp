/** PasswordReset.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Password reset page
 */
'use client';
import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Components
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';

// hooks
import UseForm from '../../../Hooks/UseForm';
import { MainStore } from '../../../Hooks/ContextStore';

// Services
import UserService from '../../../Services/UserService';

// Utilities
import CheckNested from '../../../Utils/CheckNested';

// Styles
import '../PasswordReset.css';

export default function PasswordResetWithToken() {
  const { resetToken } = useParams<{ resetToken: string }>();
  const router = useRouter();
  const userService = new UserService();
  const searchParams = useSearchParams();

  // Hooks
  const [pageState, setPageState] = useState({ invalidToken: false, succesfulReset: false });
  const [errors, setErrors] = useState({} as any);
  const { authToken } = useContext(MainStore);

  // This page is only meant to be used when the user is not authenticated
  useEffect(() => {
    if (authToken.token) router.push(searchParams.get('redirect') || '/home');
  }, [authToken]);

  // Initial call, verifies that the token is valid
  useEffect(() => {
    userService
      .validateResetPasswordToken(resetToken)
      .then(() => {
        setPageState(pageState);
      })
      .catch(() => {
        setPageState({ invalidToken: true, succesfulReset: false });
      });
  }, []);

  // State for the form
  const setResetPasswordForm = UseForm(setResetPasswordCallback, {
    newPassword: '',
    confirmPassword: '',
  });

  async function setResetPasswordCallback() {
    try {
      setErrors({});

      // Sends the new password
      await userService.setResetNewPassword(resetToken, setResetPasswordForm.values);

      setResetPasswordForm.clear();
      setPageState({ invalidToken: false, succesfulReset: true });
    } catch (error: any) {
      setPageState({ invalidToken: false, succesfulReset: false });
      if (CheckNested(error, 'response', 'data', 'errors')) setErrors(error.response.data.errors);
    }
  }

  return (
    <div className="PasswordReset">
      {/* Invalid Token response */}
      {pageState.invalidToken && !pageState.succesfulReset && (
        <div>
          <h1>Invalid token</h1>
          <p>This password reset token is no longer valid</p>
          <Link href="/">Go back</Link>
        </div>
      )}
      {/* Success response */}
      {!pageState.invalidToken && pageState.succesfulReset && (
        <div>
          <h1>Password successfully reset</h1>
          <p>
            The password has been reset, please <Link href="/">login</Link> with the new password
          </p>
        </div>
      )}
      {/* Reset password form */}
      {!pageState.invalidToken && !pageState.succesfulReset && (
        <div>
          <div>
            <h1>Reset password</h1>
            <form onSubmit={setResetPasswordForm.onSubmit}>
              <Input
                error={errors.newPassword ? true : false}
                label="New Password"
                name="newPassword"
                type="password"
                value={setResetPasswordForm.values.newPassword}
                onChange={setResetPasswordForm.onChange}
              />
              <Input
                error={errors.confirmPassword ? true : false}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={setResetPasswordForm.values.confirmPassword}
                onChange={setResetPasswordForm.onChange}
              />
              <Button type="submit" accent>
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

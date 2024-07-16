/** PasswordReset.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Password reset page
 */
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Components
import Button from '../../Components/Button';
import Input from '../../Components/Input';

// hooks
import UseForm from '../../Hooks/UseForm';
import { MainStore } from '../../Hooks/ContextStore';

// Services
import UserService from '../../Services/UserService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Styles
import './PasswordReset.css';

export default class PasswordReset {
  static sendTokenPage = (): JSX.Element => {
    const userService = new UserService();
    const navigate = useNavigate();
    const location = useLocation();

    // Hooks
    const [errors, setErrors] = useState({} as any);
    const [formSent, setFormSent] = useState(false);
    const { authToken } = useContext(MainStore);

    // This page is only meant to be used when the user is not authenticated
    useEffect(() => {
      if (authToken.token) {
        navigate(location.state ? (location.state as any).path : '/home');
      }
    }, [authToken]);

    // State for the form
    const sendTokenForm = UseForm(sendTokenCallback, {
      username: '',
    });

    async function sendTokenCallback() {
      try {
        setErrors({});

        // trims the email and changes to lowercase
        sendTokenForm.values.username = sendTokenForm.values.username.trim().toLowerCase();

        await userService.generateResetPasswordToken(sendTokenForm.values.username);

        setFormSent(true);
        // sends the request
      } catch (error: any) {
        setFormSent(false);
        if (CheckNested(error, 'response', 'data', 'errors')) setErrors(error.response.data.errors);
      }
    }

    return (
      <div className="PasswordReset">
        {/*Form sent message*/}
        {formSent && (
          <div>
            <h1>Email sent</h1>
            <p>A password reset email has been sent.</p>
          </div>
        )}

        {/*Reset form*/}
        {!formSent && (
          <div>
            <h1>Reset password</h1>
            <form onSubmit={sendTokenForm.onSubmit}>
              <Input
                error={errors.username ? true : false}
                label="Email"
                name="username"
                type="text"
                value={sendTokenForm.values.username}
                onChange={sendTokenForm.onChange}
              />
              <Button type="submit" accent>
                Submit
              </Button>
            </form>
          </div>
        )}
      </div>
    );
  };

  static setResetPassword = (): JSX.Element => {
    const userService = new UserService();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUrl = window.location.href.split('/');
    const token = currentUrl[currentUrl.length - 1];

    // Hooks
    const [pageState, setPageState] = useState({ invalidToken: false, succesfulReset: false });
    const [errors, setErrors] = useState({} as any);
    const { authToken } = useContext(MainStore);

    // This page is only meant to be used when the user is not authenticated
    useEffect(() => {
      if (authToken.token) {
        navigate(location.state ? (location.state as any).path : '/home');
      }
    }, [authToken]);

    // Initial call, verifies that the token is valid
    useEffect(() => {
      userService
        .validateResetPasswordToken(token)
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
        await userService.setResetNewPassword(token, setResetPasswordForm.values);

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
            <Link to="/">Go back</Link>
          </div>
        )}
        {/* Success response */}
        {!pageState.invalidToken && pageState.succesfulReset && (
          <div>
            <h1>Password successfully reset</h1>
            <p>
              The password has been reset, please <Link to="/">login</Link> with the new password
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
  };
}

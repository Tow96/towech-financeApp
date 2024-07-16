/** Login.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Login Page for the App
 * Based from: https://codepen.io/meodai/pen/rNedxBa
 */
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Components
import Button from '../../Components/Button';
import Checkbox from '../../Components/Checkbox';
import Input from '../../Components/Input';
import Loading from '../../Components/Loading';

// hooks
import UseForm from '../../Hooks/UseForm';
import { MainStore } from '../../Hooks/ContextStore';

// Services
import AuthenticationService from '../../Services/AuthenticationService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Styles
import './Login.css';

const Login = (): JSX.Element => {
  // Declares the service
  const authService = new AuthenticationService();
  const navigate = useNavigate();
  const location = useLocation();

  // Hooks
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any);
  const { authToken, dispatchAuthToken } = useContext(MainStore);

  // State for the form
  const loginForm = UseForm(loginCallback, {
    username: '',
    password: '',
    keepSession: false,
  });

  useEffect(() => {
    if (authToken.token) {
      navigate(location.state ? (location.state as any).path : '/home');
    }
  }, [authToken]);

  async function loginCallback() {
    try {
      setErrors({});

      // trims the email and changes to lowercase
      loginForm.values.username = loginForm.values.username.trim().toLowerCase();
      const res = await authService.login(loginForm.values, setLoading);

      dispatchAuthToken({ type: 'LOGIN', payload: res.data });
    } catch (error: any) {
      // If any error happens, clears the password field
      loginForm.values.password = '';

      if (CheckNested(error, 'response', 'data', 'errors')) setErrors(error.response.data.errors);
    }
  }

  return (
    <div className="Login">
      {/*Loading icon*/}
      {loading && (
        <div className="Login__loading">
          <Loading className="Login__spinner" />
        </div>
      )}
      {/* Content*/}
      <div className={loading ? 'loading' : ' '}>
        <h1>Login</h1>
        {/*Login form*/}
        <form onSubmit={loginForm.onSubmit}>
          <Input
            error={errors.login ? true : false}
            label="Email"
            name="username"
            type="text"
            value={loginForm.values.username}
            onChange={loginForm.onChange}
          />
          <Input
            error={errors.login ? true : false}
            label="Password"
            name="password"
            type="password"
            value={loginForm.values.password}
            onChange={loginForm.onChange}
          />
          <div className="Login__bottomRow">
            <Checkbox
              dark
              label="Keep me logged in"
              name="keepSession"
              checked={loginForm.values.keepSession}
              onChange={loginForm.onChange}
            />
            <Button type="submit" accent>
              Login
            </Button>
          </div>
        </form>
        <Link className="Login__resetLink" to="/reset">
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default Login;

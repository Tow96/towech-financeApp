/** App.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Component that holds all pages and views
 */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

// Pages
import Transactions from './Pages/Transactions';
import Login from './Pages/Login';
import Wallets from './Pages/Wallets';
import Settings from './Pages/Settings';
import PasswordReset from './Pages/PasswordReset/PasswordReset';
import VerifyAccount from './Pages/VerifyAccount/VerifyAccount';
// import Categories from './Pages/Categories';

// Components
import NotFound from './Components/NotFound';

// Hooks
import { MainStore } from './Hooks/ContextStore';
import useToken from './Hooks/UseToken';
import useCategories from './Hooks/UseCategories';
import useWallets from './Hooks/UseWallets';

// Services
import AuthenticationService from './Services/AuthenticationService';

// Utils
import AuthRoute from './Utils/AuthRoute';

function App(): JSX.Element {
  // Declares the service
  const authService = new AuthenticationService();

  // Hooks
  const [authToken, dispatchAuthToken] = useToken();
  const [categories, dispatchCategories] = useCategories();
  const [wallets, dispatchWallets] = useWallets();

  // use Effect for first load
  useEffect(() => {
    authService
      .refreshToken()
      .then((res) => {
        // The keep session is ignored for this call
        dispatchAuthToken({ type: 'LOGIN', payload: res.data });
      })
      .catch(() => {
        dispatchAuthToken({ type: 'LOGOUT', payload: { token: '' } });
      });
  }, []);

  return (
    <div className="App">
      <MainStore.Provider
        value={{ authToken, dispatchAuthToken, categories, dispatchCategories, wallets, dispatchWallets }}
      >
        <Router>
          <Routes>
            <Route
              path="/home"
              element={
                <AuthRoute>
                  <Transactions />
                </AuthRoute>
              }
            />
            <Route
              path="/wallets/*"
              element={
                <AuthRoute>
                  <Wallets />
                </AuthRoute>
              }
            />
            {/* <Route
              path="/categories"
              element={
                <AuthRoute>
                  <Categories />
                </AuthRoute>
              }
            /> */}
            <Route
              path="/settings/"
              element={
                <AuthRoute>
                  <Settings />
                </AuthRoute>
              }
            />
            <Route path="/reset" element={<PasswordReset.sendTokenPage />} />
            <Route path="/reset/*" element={<PasswordReset.setResetPassword />} />
            <Route path="/verify/*" element={<VerifyAccount.verifyPage />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </MainStore.Provider>
    </div>
  );
}

export default App;

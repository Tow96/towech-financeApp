/** (auth-routes)/layout.tsx
 * Copyright (c) 2023, TowechLabs
 *
 * Layout for all authenticated pages.
 * Includes the auth provider as well as the navbar
 */
import { ReactNode } from 'react';
import { AuthenticationProvider } from '@financeapp/frontend-authentication';
import { Navbar } from '@financeapp/frontend-navbar';

const AuthLayout = ({ children }: { children?: ReactNode }) => (
  <AuthenticationProvider>
    <div className="flex h-screen flex-col sm:w-screen sm:flex-row">
      <Navbar />
      <div className="flex flex-1">{children}</div>
    </div>
  </AuthenticationProvider>
);

export default AuthLayout;

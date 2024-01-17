/** (auth-routes)/layout.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Layout for all authenticated pages.
 * Includes the auth provider as well as the navbar
 */
import { AuthProvider } from '@/libs/feature-authentication/AuthProvider';
import { Navbar } from '@/libs/feature-navbar/Navbar';

const AuthLayout = ({ children }: { children?: React.ReactNode }) => (
  <AuthProvider>
    <div className="flex h-screen flex-col sm:w-screen sm:flex-row">
      <Navbar />
      <div className="flex flex-1">{children}</div>
    </div>
  </AuthProvider>
);

export default AuthLayout;

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
    <div className="flex flex-col sm:flex-row">
      <Navbar />
      {children}
    </div>
  </AuthProvider>
);

export default AuthLayout;

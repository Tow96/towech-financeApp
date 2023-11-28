/** (no-auth-routes)/layout.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Layout for unauthenticated pages.
 * Sets the Provider correctly
 */
import { AuthProvider } from '@/libs/feature-authentication/AuthProvider';

const NoAuthLayout = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider auth={false}>{children}</AuthProvider>
);

export default NoAuthLayout;

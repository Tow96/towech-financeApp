import { ReactNode } from 'react';
import { AuthenticationProvider } from '@financeapp/frontend-authentication';

const NoAuthLayout = ({ children }: { children?: ReactNode }) => (
  <AuthenticationProvider protectedRoute={false}>{children}</AuthenticationProvider>
);

export default NoAuthLayout;

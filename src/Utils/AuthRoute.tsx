/** AuthRoute.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Route component with the ability to redirect depending if there is an Authentication Token
 */
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

// Hooks
import { MainStore } from '../Hooks/ContextStore';

const AuthRoute = ({ children }: any): JSX.Element => {
  const { authToken } = useContext(MainStore);

  // Checks the notAuth flag, if present, redirects when logged in
  return authToken.token ? (
    children
  ) : (
    <Navigate to="/" replace state={{ path: `${location.pathname}${location.search}` }} />
  );
};

export default AuthRoute;

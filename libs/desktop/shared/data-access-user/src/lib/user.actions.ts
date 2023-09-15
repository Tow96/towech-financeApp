import { EditUser, LoginUser, UserModel } from '@finance/shared/utils-types';
import { UserResponse } from './types';
import { createApiCallActions } from './rxjs.utils';

export const loginActions = createApiCallActions<Partial<LoginUser>, UserResponse>(
  'Login Screen',
  'Login'
);
export const logoutActions = createApiCallActions<undefined, undefined>('Navbar', 'Logout');
export const refreshActions = createApiCallActions<unknown, UserResponse>(
  'User Service',
  'Refresh'
);

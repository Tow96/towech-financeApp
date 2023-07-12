/** user-state.actions.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Actions for the user-state reducer
 */
// Libraries
import { createAction, props } from '@ngrx/store';
// Models
import { LoginUser, UserModel } from '@towech-finance/shared/utils/models';

export const login = createAction('[Login Page] Login', props<{ credentials: LoginUser }>());

export const loginSuccess = createAction(
  '[User Effects] Login Success',
  props<{ token: string; user: UserModel }>()
);

export const loginFailure = createAction(
  '[User Effects] Login Failure',
  props<{ message: string }>()
);

export const refreshToken = createAction('[User Effects] RefreshToken');

export const refreshTokenSuccess = createAction(
  '[User Effects] RefreshToken Success',
  props<{ token: string; user: UserModel }>()
);

export const refreshTokenFailure = createAction('[User Effects] Refresh Token Failure');

export const logout = createAction('[NavBar] Logout');

export const logoutSuccess = createAction('[User Effects] Logout Success');

export const logoutFailure = createAction(
  '[User Effects] Logout Failure',
  props<{ message: string }>()
);

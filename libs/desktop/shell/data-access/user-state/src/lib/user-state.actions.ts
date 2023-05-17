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

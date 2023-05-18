/** user-state.reducer.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Reducer that contains the logged in user data
 */
// Libraries
import { createReducer, on } from '@ngrx/store';
// Models
import { UserModel } from '@towech-finance/shared/utils/models';
// NGRX
import * as actions from './user-state.actions';

export const userStateFeatureKey = 'user';

export interface State {
  loaded: boolean;
  loading: boolean;
  user: UserModel | null;
  token: string | null;
}

export const initialState: State = {
  loaded: false,
  loading: false,
  user: null,
  token: null,
};

export const reducer = createReducer(
  initialState,
  on(actions.login, actions.refreshToken, state => ({ ...state, loading: true })),
  on(actions.loginFailure, actions.refreshTokenFailure, state => ({
    ...state,
    loading: false,
    loaded: true,
  })),
  on(actions.loginSuccess, actions.refreshTokenSuccess, (state, action) => ({
    ...state,
    loaded: true,
    loading: false,
    token: action.token,
    user: { ...action.user },
  }))
);

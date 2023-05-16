/** user-state.reducer.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Reducer that contains the logged in user data
 */
// Libraries
import { createReducer } from '@ngrx/store';
// Models
import { UserModel } from '@towech-finance/shared/utils/models';

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

export const reducer = createReducer(initialState);

import { createReducer, on } from '@ngrx/store';
import { Status, State, UserResponse } from './types';
import { editActions, loginActions, logoutActions, refreshActions } from './user.actions';
import { UserModel } from '@finance/shared/utils-types';

export const initialState: State = {
  data: null,
  status: Status.INIT,
  token: null,
};

// TODO: create adapter?
const setStatusComplete = (state: State): State => ({ ...state, status: Status.COMPLETED });
const setStatusInProgress = (state: State): State => ({ ...state, status: Status.IN_PROGRESS });
const setStatusFailed = (state: State): State => ({ ...state, status: Status.FAILED });
// TODO: Create ActionType
const setUser = (state: State, action: { type: string; payload: UserResponse }): State => ({
  ...state,
  data: action.payload.user,
  token: action.payload.token,
});
const clearUser = (state: State) => ({ ...state, data: null, token: null });
const updateUser = (state: State, user: UserModel): State => ({
  ...state,
  data: { ...user, exp: state.data?.exp || 0, iat: state.data?.iat || 0 },
});

export const reducer = createReducer<State>(
  initialState,
  // Status
  on(loginActions.do, logoutActions.do, refreshActions.do, editActions.do, state =>
    setStatusInProgress(state)
  ),
  on(
    loginActions.success,
    refreshActions.success,
    logoutActions.success,
    editActions.success,
    state => setStatusComplete(state)
  ),
  on(
    loginActions.failure,
    refreshActions.failure,
    logoutActions.failure,
    editActions.failure,
    state => setStatusFailed(state)
  ),
  // Data & token
  on(loginActions.success, refreshActions.success, (state, action) => setUser(state, action)),
  on(refreshActions.failure, logoutActions.success, logoutActions.failure, state =>
    clearUser(state)
  ),
  on(editActions.success, (state, { payload }) => updateUser(state, payload))
);

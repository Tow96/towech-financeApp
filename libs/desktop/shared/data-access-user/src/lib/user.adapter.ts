import { UserModel } from '@finance/shared/utils-types';
import { Status } from './types';
import { createAdapter } from '@state-adapt/core';

export interface State {
  data: UserModel | null;
  status: Status;
  token: string | null;
}

export const initialState: State = {
  data: null,
  status: Status.INIT,
  token: null,
};

export const adapter = createAdapter<State>()({
  clearUser: state => ({ ...state, data: null, token: null }),
  setUser: (state, value): State => ({ ...state, data: value.user, token: value.token }),
  setStatusComplete: state => ({ ...state, status: Status.COMPLETED }),
  setStatusFailed: state => ({ ...state, status: Status.FAILED }),
  setStatusInProgress: state => ({ ...state, status: Status.IN_PROGRESS }),
  selectors: {
    isLoggedIn: user => ({
      loaded: user.status === Status.COMPLETED || user.status === Status.FAILED,
      logged: user.data !== null,
    }),
    status: user => user.status,
    // data: user => user.data,
    // token: user => user.token,
  },
});

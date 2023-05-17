// Tested Elements
import { initialState as Init, reducer, State } from './user-state.reducer';
// NGRX
import { login, loginFailure, loginSuccess } from './user-state.actions';
import { UserModel, UserRoles } from '@towech-finance/shared/utils/models';

describe('User Reducer', () => {
  let action: any;
  let initialState: State;
  let result: State;

  beforeEach(() => (initialState = Init));

  describe('Unknown action', () => {
    it('Should return the exact current state', () => {
      action = { type: 'Unknown' };

      result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('login', () => {
    it('Should return an immutable state with loading', () => {
      const newState: State = {
        loaded: false,
        loading: true,
        token: null,
        user: null,
      };

      action = login({
        credentials: { keepSession: false, password: 'pass', username: 'testino' },
      });
      result = reducer(initialState, action);

      expect(result).toEqual(newState);
      expect(result).not.toBe(newState);
    });
  });

  describe('loginSuccess', () => {
    it('Should return an immutable state containing the token and the user', () => {
      const user: UserModel = {
        _id: '0',
        accountConfirmed: false,
        mail: 'test@gmail.com',
        name: 'TESTINO',
        role: UserRoles.USER,
      };
      const token = 'this is totally a JWT';

      action = loginSuccess({ token, user });
      result = reducer({ ...initialState, loading: true }, action);

      expect(result).toEqual({ ...initialState, loading: false, loaded: true, user, token });
      expect(result.user).not.toBe(user);
    });
  });

  describe('loginFailure', () => {
    it('Should return an immutable state without loading', () => {
      action = loginFailure({ message: 'Fail' });
      result = reducer({ ...initialState, loading: true }, action);

      expect(result).toEqual({ ...initialState, loading: false });
    });
  });
});

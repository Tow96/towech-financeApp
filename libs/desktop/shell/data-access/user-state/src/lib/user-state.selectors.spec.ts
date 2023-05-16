// Tested elements
import * as userSelectors from './user-state.selectors';
// NGRX
import { State } from './user-state.reducer';
import { UserRoles } from '@towech-finance/shared/utils/models';

describe('User selectors', () => {
  let initialState: State;
  let result: any;

  beforeEach(() => {
    initialState = {
      loaded: true,
      loading: false,
      token: 'this defintely is a jwt string',
      user: {
        _id: '0',
        accountConfirmed: false,
        mail: 'user@mail.com',
        name: 'TESTINO',
        role: UserRoles.USER,
      },
    };
  });

  describe('selectUser', () => {
    it('Should return the logged in user', () => {
      result = userSelectors.selectUser.projector(initialState);
      expect(result).toBe(initialState.user);
    });
  });

  describe('isLoggedIn', () => {
    it('Should return true when a user is registered', () => {
      result = userSelectors.isLoggedIn.projector(initialState);
      expect(result).toBe(true);
    });

    it('Should return false when a user is not registered', () => {
      initialState.user = null;

      result = userSelectors.isLoggedIn.projector(initialState);
      expect(result).toBe(false);
    });
  });

  describe('selectLoadState', () => {
    it('Should return the loading flags', () => {
      result = userSelectors.selectLoadState.projector(initialState);
      expect(result).toEqual({ loaded: initialState.loaded, loading: initialState.loading });
    });
  });
});

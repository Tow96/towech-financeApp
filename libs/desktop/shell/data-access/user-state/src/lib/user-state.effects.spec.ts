// Libraries
import { TestBed } from '@angular/core/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
// Tested elements
import { UserEffects } from './user-state.effects';
// Mocks
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  MockDesktopAuthenticationService,
  stubToken,
  stubUser,
} from '@towech-finance/desktop/mocks';
// Services
import { DesktopAuthenticationService } from '@towech-finance/desktop/shell/data-access/authentication';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
// NGRX
import * as userActions from './user-state.actions';
import { userStateFeatureKey, initialState } from './user-state.reducer';

describe('User Effects', () => {
  let actions$: Observable<any>;
  let api: DesktopAuthenticationService;
  let effects: UserEffects;
  let result: any;
  let spy: SubscriberSpy<any>;
  let toasts: DesktopToasterService;

  const initialStore = {
    [userStateFeatureKey]: initialState,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        MockDesktopAuthenticationService,
        DesktopToasterService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialStore }),
      ],
    });

    actions$ = TestBed.inject(Actions);
    api = TestBed.inject(DesktopAuthenticationService);
    effects = TestBed.inject(UserEffects);
    toasts = TestBed.inject(DesktopToasterService);
  });

  it('Should be created', () => expect(effects).toBeTruthy());

  describe('showError', () => {
    it('show add a toast to the tray and do nothing else', () => {
      const toastSpy = jest.spyOn(toasts, 'add');

      actions$ = of(userActions.loginFailure({ message: 'TESTING' }));

      const effectSpy = subscribeSpyTo(effects.errorEffect);
      const result = effectSpy.getLastValue();

      expect(result).toBeUndefined();
      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenLastCalledWith('TESTING');
    });
  });

  describe('login', () => {
    const makeCall = (): void => {
      actions$ = of(userActions.login);
      spy = subscribeSpyTo(effects.login);
      result = spy.getLastValue();
    };

    beforeEach(() => jest.clearAllMocks());

    it('Should call the auth service', () => {
      makeCall();
      expect(api.login).toHaveBeenCalledTimes(1);
    });

    it('Should return a loginSuccess action when login works correctly', () => {
      makeCall();
      expect(result).toEqual(userActions.loginSuccess({ token: stubToken(), user: stubUser() }));
    });

    it('Should return a loginFailure action when not working correctly', () => {
      const oldEnv = { ...process.env };
      process.env['FAILHTTP'] = 'true';
      makeCall();

      expect(result).toEqual(userActions.loginFailure({ message: expect.any(String) }));

      process.env = { ...oldEnv };
    });
  });
});

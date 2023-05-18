// Libraries
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
// Tested elements
import { UserEffects } from './user-state.effects';
// Mocks
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
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
  let router: Router;
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
      imports: [RouterTestingModule.withRoutes([{ path: 'login', redirectTo: '' }])],
    });

    actions$ = TestBed.inject(Actions);
    api = TestBed.inject(DesktopAuthenticationService);
    effects = TestBed.inject(UserEffects);
    router = TestBed.inject(Router);
    toasts = TestBed.inject(DesktopToasterService);
  });

  it('Should be created', () => expect(effects).toBeTruthy());

  describe('initialLoad', () => {
    it('should dispatch a refreshToken Action', () => {
      actions$ = of({ type: '@ngrx/effects/init' });
      spy = subscribeSpyTo(effects.initialLoad);
      result = spy.getLastValue();

      expect(result).toEqual(userActions.refreshToken());
    });
  });

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

  describe('refresh', () => {
    const makeCall = (): void => {
      actions$ = of(userActions.refreshToken);
      spy = subscribeSpyTo(effects.refresh);
      result = spy.getLastValue();
    };

    beforeEach(() => jest.clearAllMocks());

    it('Should call the auth service', () => {
      makeCall();
      expect(api.refresh).toHaveBeenCalledTimes(1);
    });

    it('Should return a refreshTokenSuccess action when login works correctly', () => {
      makeCall();
      expect(result).toEqual(
        userActions.refreshTokenSuccess({ token: stubToken(), user: stubUser() })
      );
    });

    it('Should return a loginFailure action when not working correctly', () => {
      const oldEnv = { ...process.env };
      process.env['FAILHTTP'] = 'true';
      makeCall();

      expect(result).toEqual(userActions.refreshTokenFailure());

      process.env = { ...oldEnv };
    });
  });

  describe('redirectToHome', () => {
    let routeSpy: any;
    beforeEach(() => {
      jest.clearAllMocks();
      routeSpy = jest.spyOn(router, 'navigate');
    });

    it('Should call the router when loginSuccess is dispatched', () => {
      actions$ = of(userActions.loginSuccess);
      spy = subscribeSpyTo(effects.redirectToHome);
      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(routeSpy).toHaveBeenLastCalledWith(['']);
    });

    it('Should call the router when refreshTokenSuccess is dispatched', () => {
      actions$ = of(userActions.refreshTokenSuccess);
      spy = subscribeSpyTo(effects.redirectToHome);
      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(routeSpy).toHaveBeenLastCalledWith(['']);
    });
  });

  describe('redirectToLogin', () => {
    let routeSpy: any;
    beforeEach(() => {
      jest.clearAllMocks();
      routeSpy = jest.spyOn(router, 'navigate');
    });

    it('Should call the router when refreshTokenFailure is dispatched', () => {
      actions$ = of(userActions.refreshTokenFailure);
      spy = subscribeSpyTo(effects.redirectToLogin);
      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(routeSpy).toHaveBeenLastCalledWith(['login']);
    });

    it('Should call the router when logoutSuccess is dispatched', () => {
      actions$ = of(userActions.logoutSuccess);
      spy = subscribeSpyTo(effects.redirectToLogin);
      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(routeSpy).toHaveBeenLastCalledWith(['login']);
    });
  });

  describe('logout', () => {
    const makeCall = (): void => {
      actions$ = of(userActions.logout);
      spy = subscribeSpyTo(effects.logout);
      result = spy.getLastValue();
    };

    beforeEach(() => jest.clearAllMocks());

    it('Should call the auth service', () => {
      makeCall();
      expect(api.logout).toHaveBeenCalledTimes(1);
    });

    it('Should return a logoutSuccess action when login works correctly', () => {
      makeCall();
      expect(result).toEqual(userActions.logoutSuccess());
    });

    it('Should return a logoutFailure action when not working correctly', () => {
      const oldEnv = { ...process.env };
      process.env['FAILHTTP'] = 'true';
      makeCall();

      expect(result).toEqual(userActions.logoutFailure({ message: expect.any(String) }));

      process.env = { ...oldEnv };
    });
  });
});

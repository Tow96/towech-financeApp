// Libraries
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { AuthGuard } from './auth.guard';
import { fromUser } from '@towech-finance/desktop/shell/data-access/user-state';
import { UserModel } from '@towech-finance/shared/utils/models';

describe('Auth Guard', () => {
  let router: Router;
  let service: AuthGuard;
  let store: MockStore<any>;
  let servSpy: SubscriberSpy<any>;

  const initialState = {
    [fromUser.userStateFeatureKey]: {
      user: {
        _id: '0',
        accountConfirmed: false,
        mail: 'test@mail.com',
        name: 'TESTINO',
        role: 'user',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [AuthGuard, provideMockStore({ initialState })],
      imports: [RouterTestingModule.withRoutes([{ path: 'login', redirectTo: '' }])],
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(AuthGuard);
    store = TestBed.get<Store>(Store);
  });

  it('Should exist', () => expect(service).toBeTruthy());

  describe('When can Activate is called with a valid user', () => {
    it('Should return true without redirecting', () => {
      const routeSpy = jest.spyOn(router, 'navigate');
      const observed = service.canActivate();
      servSpy = subscribeSpyTo(observed);

      expect(routeSpy).toHaveBeenCalledTimes(0);
      expect(servSpy.getLastValue()).toBe(true);
    });
  });

  describe('When can Activate is called with an invalid user', () => {
    it('Should return true without redirecting', () => {
      const routeSpy = jest.spyOn(router, 'navigate');
      store.setState({ [fromUser.userStateFeatureKey]: { user: null } });

      const observed = service.canActivate();
      servSpy = subscribeSpyTo(observed);

      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(servSpy.getLastValue()).toBe(false);
    });
  });
});

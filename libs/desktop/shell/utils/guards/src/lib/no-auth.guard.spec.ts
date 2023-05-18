// Libraries
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { NoAuthGuard } from './no-auth.guard';
import { fromUser } from '@towech-finance/desktop/shell/data-access/user-state';

describe('No Auth Guard', () => {
  let router: Router;
  let service: NoAuthGuard;
  let store: MockStore<any>;
  let servSpy: SubscriberSpy<any>;
  let routeSpy: any;

  const initialState = {
    [fromUser.userStateFeatureKey]: {
      user: {
        _id: '0',
        accountConfirmed: false,
        mail: 'test@mail.com',
        name: 'TESTINO',
        role: 'user',
      },
      loaded: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [NoAuthGuard, provideMockStore({ initialState })],
      imports: [RouterTestingModule.withRoutes([{ path: 'login', redirectTo: '' }])],
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(NoAuthGuard);
    store = TestBed.get<Store>(Store);

    routeSpy = jest.spyOn(router, 'navigate');
  });

  it('Should exist', () => expect(service).toBeTruthy());

  describe('When can Activate is called with a valid user', () => {
    it('Should return false and redirect to dashboard', () => {
      const observed = service.canActivate();
      servSpy = subscribeSpyTo(observed);

      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(routeSpy).toHaveBeenCalledWith(['']);
      expect(servSpy.getLastValue()).toBe(false);
    });
  });

  describe('When can Activate is called with an invalid user', () => {
    it('Should return true and not redirect', () => {
      store.setState({ [fromUser.userStateFeatureKey]: { user: null, loaded: true } });

      const observed = service.canActivate();
      servSpy = subscribeSpyTo(observed);

      expect(routeSpy).toHaveBeenCalledTimes(0);
      expect(servSpy.getLastValue()).toBe(true);
    });
  });
});

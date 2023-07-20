// Libraries
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Observable, of } from 'rxjs';
// Tested elements
import { DesktopUserAuthGuard } from './auth.guard';
// Services
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';

const mockState = (value: boolean) => ({
  store: {
    isLoggedIn$: of({ loaded: true, logged: value }),
  },
});

describe('Auth Guard', () => {
  let router: Router;
  let service: DesktopUserAuthGuard;
  let servSpy: SubscriberSpy<boolean>;
  let routeSpy: jest.SpyInstance<Promise<boolean>>;
  let observed: Observable<boolean>;

  const setModule = (value: boolean) => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: DesktopUserService, useValue: mockState(value) },
        DesktopUserAuthGuard,
      ],
      imports: [RouterTestingModule.withRoutes([{ path: 'login', redirectTo: '' }])],
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(DesktopUserAuthGuard);

    routeSpy = jest.spyOn(router, 'navigate');
  };

  beforeEach(() => setModule(true));

  it('Should exist', () => expect(service).toBeTruthy());

  describe('When can Activate is called with a valid user', () => {
    it('Should return true and not redirect', () => {
      observed = service.canActivate();
      servSpy = subscribeSpyTo(observed);

      expect(routeSpy).toHaveBeenCalledTimes(0);
      expect(servSpy.getLastValue()).toBe(true);
    });
  });

  describe('When can Activate is called with an invalid user', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      setModule(false);
    });

    it('Should return false', () => {
      observed = service.canActivate();
      servSpy = subscribeSpyTo(observed);

      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(routeSpy).toHaveBeenCalledWith(['login']);
      expect(servSpy.getLastValue()).toBe(false);
    });
  });
});

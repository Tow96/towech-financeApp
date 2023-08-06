// Libraries
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Observable, of } from 'rxjs';
// Tested elements
import { DesktopUserNoAuthGuard } from './no-auth.guard';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';

const mockState = (value: boolean) => ({
  store: {
    isLoggedIn$: of({ loaded: true, logged: value }),
  },
});

describe('No Auth Guard', () => {
  let router: Router;
  let service: DesktopUserNoAuthGuard;
  let servSpy: SubscriberSpy<boolean>;
  let routeSpy: jest.SpyInstance<Promise<boolean>>;
  let observed: Observable<boolean>;

  const setModule = (value: boolean) => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: DesktopUserService, useValue: mockState(value) },
        DesktopUserNoAuthGuard,
      ],
      imports: [RouterTestingModule.withRoutes([{ path: 'login', redirectTo: '' }])],
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(DesktopUserNoAuthGuard);

    routeSpy = jest.spyOn(router, 'navigate');
  };

  beforeEach(() => setModule(false));

  it('Should exist', () => expect(service).toBeTruthy());

  describe('When can Activate is called with an invalid user', () => {
    it('Should return true and not redirect', () => {
      observed = service.canActivate();
      servSpy = subscribeSpyTo(observed);

      expect(routeSpy).toHaveBeenCalledTimes(0);
      expect(servSpy.getLastValue()).toBe(true);
    });
  });

  describe('When can Activate is called with a valid user', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      setModule(true);
    });

    it('Should return false and redirect to dashboard', () => {
      observed = service.canActivate();
      servSpy = subscribeSpyTo(observed);

      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(routeSpy).toHaveBeenCalledWith(['']);
      expect(servSpy.getLastValue()).toBe(false);
    });
  });
});

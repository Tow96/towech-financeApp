// Libraries
import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom, of } from 'rxjs';
// Tested elements
import { refreshInterceptor } from './refresh.interceptor';
// Services
import { DesktopUserService } from './user.service';
import { environment } from '@finance/desktop/shared/utils-environments';

const stubToken = () => 'tokencontent';
const token = new BehaviorSubject<{ expired: boolean; value: string }>({
  expired: false,
  value: stubToken(),
});
const mockUserService = {
  refresh: jest.fn(() => {
    token.next({
      expired: false,
      value: stubToken(),
    });
  }),
  token$: token,
};

describe('refreshInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => refreshInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  function interceptorDidNothing(request: HttpRequest<unknown>) {
    return (a: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
      expect(a).toBe(request);
      return of({} as HttpEvent<undefined>);
    };
  }

  it('Should do nothing if the user service is not available', () => {
    const request = new HttpRequest('GET', 'test', {});
    interceptor(request, interceptorDidNothing(request));
  });

  describe('When the user service is available', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: DesktopUserService, useValue: mockUserService }],
      });
    });

    it('Should do nothing if the called endpoint is not the finance api', () => {
      const request = new HttpRequest('GET', 'defintely not the api', {});
      interceptor(request, interceptorDidNothing(request));
    });
    it('Should do nothing if the called endpoint is the refresh endpoint', () => {
      const request = new HttpRequest('POST', `${environment.apiUrl}/refresh`, {});
      interceptor(request, interceptorDidNothing(request));
    });
    it('Should do nothing if the called endpoint is the login endpoint', () => {
      const request = new HttpRequest('PATCH', `${environment.apiUrl}/login`, {});
      interceptor(request, interceptorDidNothing(request));
    });
    it('Should do nothing if the called endpoint is the logout endpoint', () => {
      const request = new HttpRequest('DELETE', `${environment.apiUrl}/logout`, {});
      interceptor(request, interceptorDidNothing(request));
    });

    describe('When a call to the api is made', () => {
      const request = new HttpRequest('POST', `${environment.apiUrl}/anyendpoint`, {});

      it('Should call the refresh service', () => {
        const refreshSpy = jest.spyOn(TestBed.inject(DesktopUserService), 'refresh');
        interceptor(request, () => of({} as HttpEvent<undefined>));
        expect(refreshSpy).toHaveBeenCalledTimes(1);
      });

      it('Should add the token to the request', async () => {
        const next = (a: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
          expect(a.headers.get('Authorization')).toBe(`Bearer ${stubToken()}`);
          // expect(a).toBe(request);
          return of({} as HttpEvent<undefined>);
        };

        const q = interceptor(request, next);
        await firstValueFrom(q);
      });
    });
  });
});

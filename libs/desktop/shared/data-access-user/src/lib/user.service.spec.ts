// Libraries
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
// Tested elements
import { DesktopUserService } from './user.service';
// Services
import { environment } from '@finance/desktop/shared/utils-environments';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Mocks
import { DesktopToasterServiceMock } from '@finance/desktop/shared/utils-testing';
// Models
import { LoginUser, UserModel, UserRoles } from '@finance/shared/utils-types';
import { Status } from './types';

// TODO move this to utils-testing
// ----------------------------------------------------------------------------
const stubLogin = (): LoginUser => ({
  keepSession: false,
  password: 'pass',
  username: 'mail@provider.com',
});

const stubTokenInitial = (): string =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJwZXN0byIsImFjY291bnRDb25maXJtZWQiOmZhbHNlLCJtYWlsIjoibWFpbEBwcm92aWRlci5jb20iLCJuYW1lIjoidXNlciIsInJvbGUiOiJ1c2VyIn0.7_4_hjpF-Tw5Xta00TUMwG7O395OE7IUMp0GsfaQoqw';
const stubTokenRefresh = (): string =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJwZXN0byIsImFjY291bnRDb25maXJtZWQiOmZhbHNlLCJtYWlsIjoibWFpbEBwcm92aWRlci5jb20iLCJuYW1lIjoidXNlciIsInJvbGUiOiJ1c2VyIn0.xJ-dAVNJy7eC3X9Q6dhJ6LAgVFuPuQB93X111ynthE8';

const stubUser = (): UserModel => ({
  _id: 'pesto',
  accountConfirmed: false,
  mail: 'mail@provider.com',
  name: 'user',
  role: UserRoles.USER,
});
const stubError = () => ({ message: 'Invalid', error: 'Unauthorized', statusCode: 401 });
const stubErrorOpts = () => ({ status: stubError().statusCode, statusText: stubError().error });

const isLogged = (input: any, loaded: boolean, logged: boolean) => {
  expect(input).toEqual({ loaded, logged });
};

describe('Desktop User Service', () => {
  let service: DesktopUserService;
  let httpController: HttpTestingController;
  let toastService: DesktopToasterService;
  let router: Router;

  // Spies
  let httpCall: TestRequest;
  let status$: SubscriberSpy<Status>;
  let user$: SubscriberSpy<UserModel | null>;
  let token$: SubscriberSpy<string | null>;
  let routerSpy: jest.SpyInstance<any>;
  let toastSpy: SubscriberSpy<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DesktopUserService,
        provideStore(),
        provideEffects(),
        { provide: DesktopToasterService, useValue: DesktopToasterServiceMock },
      ],
    });
    service = TestBed.inject<DesktopUserService>(DesktopUserService);
    httpController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    toastService = TestBed.inject<DesktopToasterService>(DesktopToasterService);

    toastSpy = subscribeSpyTo(toastService.addError$);
    routerSpy = jest.spyOn(router, 'navigate');
    status$ = subscribeSpyTo(service.status$);
    user$ = subscribeSpyTo(service.value$);
    token$ = subscribeSpyTo(service.token$);
  });

  it('Should be defined', () => expect(service).toBeTruthy());
  // it('Should have null initial values', () => {
  //   expect(user$.getFirstValue()).toBe(null);
  //   expect(token$.getFirstValue()).toBe(null);
  //   expect(status$.getFirstValue()).toBe(Status.INIT);
  // });
  it('Should call the refresh endpoint when initiated', () => {
    httpCall = httpController.expectOne(`${environment.apiUrl}/refresh`);
    expect(httpCall.request.method).toEqual('POST');
  });

  describe('When the login is called', () => {
    beforeEach(() => {
      service.login(stubLogin());
      httpCall = httpController.expectOne(`${environment.apiUrl}/login`);
    });

    it('Should change the store status to in progress', () =>
      expect(status$.getLastValue()).toEqual(Status.IN_PROGRESS));
    it('Should call the auth api', () => {
      expect(httpCall.request.method).toEqual('POST');
      expect(httpCall.request.body).toEqual(stubLogin());
    });

    describe('When the authentication microservice answers with a successful response', () => {
      beforeEach(() => httpCall.flush({ token: stubTokenInitial() }));

      it('Should change the store status to completed', () =>
        expect(status$.getLastValue()).toEqual(Status.COMPLETED));
      it('Should update the user', () => expect(user$.getLastValue()).toEqual(stubUser()));
      it('Should update the token', () =>
        expect(token$.getLastValue()).toEqual(stubTokenInitial()));
      it('Should change the isLoggedIn selector to be true', () =>
        isLogged(subscribeSpyTo(service.isLoggedIn$).getLastValue(), true, true));
      it('Should redirect to the dashboard', () => expect(routerSpy).toHaveBeenCalledWith(['']));
      it('Should not send a toast', () => expect(toastSpy.receivedNext()).toBeFalsy());
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should update the store status to failed', () =>
        expect(status$.getLastValue()).toEqual(Status.FAILED));
      it('Should change the isLoggedIn selector to be false', () =>
        isLogged(subscribeSpyTo(service.isLoggedIn$).getLastValue(), true, false));
      it('Should send an error to the toast service', () =>
        expect(toastSpy.receivedNext()).toBeTruthy());
      it('Should stay on the same page', () => expect(routerSpy).toHaveBeenCalledTimes(0));
    });
  });

  describe('When refresh pipe is called', () => {
    beforeEach(() => {
      // Flush the SET refresh call
      httpController
        .expectOne(`${environment.apiUrl}/refresh`)
        .flush({ token: stubTokenInitial() });
      service.refresh();
      httpCall = httpController.expectOne(`${environment.apiUrl}/refresh`);
    });

    it('Should set the status to in progress', () =>
      expect(status$.getLastValue()).toBe(Status.IN_PROGRESS));
    it('Should call the authentication microservice', () =>
      expect(httpCall.request.method).toEqual('POST'));

    describe('When a successful response is received', () => {
      beforeEach(() => httpCall.flush({ token: stubTokenRefresh() }));

      it('Should change the store status to completed', () =>
        expect(status$.getLastValue()).toBe(Status.COMPLETED));
      it('Should update the user', () => expect(user$.getLastValue()).toEqual(stubUser()));
      it('Should update the token', () => expect(token$.getLastValue()).toBe(stubTokenRefresh()));
      it('Should stay on the same page', () => expect(routerSpy).toHaveBeenCalledTimes(0));
      it('Should not send a toast', () => expect(toastSpy.receivedNext()).toBeFalsy());
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should update the store status to failed', () =>
        expect(status$.getLastValue()).toBe(Status.FAILED));
      it('Should remove the user', () => expect(user$.getLastValue()).toBe(null));
      it('Should remove the token', () => expect(token$.getLastValue()).toBe(null));
      it('Should navigate to the login screen', () =>
        expect(routerSpy).toHaveBeenCalledWith(['login']));
      it('Should not send a toast', () => expect(toastSpy.receivedNext()).toBeFalsy());
    });
  });

  describe('When the logout is called', () => {
    beforeEach(() => {
      // Flush the SET refresh call
      httpController
        .expectOne(`${environment.apiUrl}/refresh`)
        .flush({ token: stubTokenInitial() });
      service.logout();
      httpCall = httpController.expectOne(`${environment.apiUrl}/logout`);
    });

    it('Should change the store status to in progress', () =>
      expect(status$.getLastValue()).toEqual(Status.IN_PROGRESS));
    it('Should call the authentication microservice', () =>
      expect(httpCall.request.method).toEqual('POST'));

    describe('When the authentication microservice answers with a successful response', () => {
      beforeEach(() => httpCall.flush({}));

      it('Should change the store status to completed', () =>
        expect(status$.getLastValue()).toEqual(Status.COMPLETED));
      it('Should remove the user', () => expect(user$.getLastValue()).toBe(null));
      it('Should remove the token', () => expect(token$.getLastValue()).toBe(null));
      it('Should redirect to login', () => expect(routerSpy).toHaveBeenCalledWith(['login']));
      it('Should not send a toast', () => expect(toastSpy.receivedNext()).toBeFalsy());
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should change the store status to failed', () =>
        expect(status$.getLastValue()).toBe(Status.FAILED));
      it('Should remove the user', () => expect(user$.getLastValue()).toBe(null));
      it('Should remove the token', () => expect(token$.getLastValue()).toBe(null));
      it('Should redirect to login', () => expect(routerSpy).toHaveBeenCalledWith(['login']));
      it('Should not send a toast', () => expect(toastSpy.receivedNext()).toBeFalsy());
    });
  });
});

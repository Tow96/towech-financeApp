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
import { adaptReducer } from '@state-adapt/core';
// Tested elements
import { DesktopUserService } from './user.service';
// Services
import { environment, provideDesktopEnvironment } from '@finance/desktop/shared/utils-environments';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Mocks
import { DesktopToasterServiceMock } from '@finance/desktop/shared/utils-testing';
// Models
import { LoginUser, UserModel, UserRoles } from '@finance/shared/utils-types';
import { Status } from './types';
import { State } from './user.adapter';

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
// ----------------------------------------------------------------------------
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
  let routerSpy: jest.SpyInstance<any>;
  let status$: SubscriberSpy<Status>;
  let state$: SubscriberSpy<State>;
  let toastSpy: SubscriberSpy<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideStore({ adapt: adaptReducer }),
        DesktopUserService,
        provideDesktopEnvironment(),
        { provide: DesktopToasterService, useValue: DesktopToasterServiceMock },
      ],
    });
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject<DesktopUserService>(DesktopUserService);
    toastService = TestBed.inject<DesktopToasterService>(DesktopToasterService);
    router = TestBed.inject(Router);

    routerSpy = jest.spyOn(router, 'navigate');
    toastSpy = subscribeSpyTo(toastService.addError$);

    state$ = subscribeSpyTo(service.store.state$);
    status$ = subscribeSpyTo(service.store.status$);
  });

  it('Should be defined', () => expect(service).toBeTruthy());

  describe('SET', () => {
    beforeEach(
      () => (httpCall = httpController.expectOne(`${environment.authenticationServiceUrl}/refresh`))
    );

    it('Should call the authentication microservice', () =>
      expect(httpCall.request.method).toEqual('POST'));
    it('Should SET a completed state when the microservice returns successful', () => {
      httpCall.flush({ token: stubTokenInitial() });
      expect(state$.getLastValue()).toEqual({
        data: stubUser(),
        token: stubTokenInitial(),
        status: Status.COMPLETED,
      });
    });
    it('Should SET a failed state when the microservice returns failed', () => {
      httpCall.flush(stubError(), stubErrorOpts());
      expect(state$.getLastValue()).toEqual({ data: null, token: null, status: Status.FAILED });
    });
  });

  describe('When the login pipe is nexted', () => {
    beforeEach(() => {
      service.login$.next(stubLogin());
      httpCall = httpController.expectOne(`${environment.authenticationServiceUrl}/login`);
    });

    it('Should call the authentication microservice', () => {
      expect(httpCall.request.method).toEqual('POST');
      expect(httpCall.request.body).toEqual(stubLogin());
    });
    it('Should change the store status to in progress', () =>
      expect(status$.getLastValue()).toEqual(Status.IN_PROGRESS));

    describe('When the authentication microservice answers with a successful response', () => {
      beforeEach(() => httpCall.flush({ token: stubTokenInitial() }));

      it('Should change the store status to completed', () =>
        expect(status$.getLastValue()).toEqual(Status.COMPLETED));
      it('Should update the state to contain the new user', () =>
        expect(state$.getLastValue()).toEqual(
          expect.objectContaining({
            data: stubUser(),
            token: stubTokenInitial(),
          })
        ));
      it('Should change the isLoggedIn selector to be true', () =>
        isLogged(subscribeSpyTo(service.store.isLoggedIn$).getLastValue(), true, true));
      it('Should redirect to the dashboard', () => expect(routerSpy).toHaveBeenCalledWith(['']));
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should update the store status to failed', () =>
        expect(status$.getLastValue()).toEqual(Status.FAILED));
      it('Should change the isLoggedIn selector to be false', () =>
        isLogged(subscribeSpyTo(service.store.isLoggedIn$).getLastValue(), true, false));
      it('Should send an error to the toast service', () =>
        expect(toastSpy.receivedNext()).toBeTruthy());
    });
  });

  describe('When the logout pipe is nexted', () => {
    beforeEach(() => {
      service.logout$.next();
      httpCall = httpController.expectOne(`${environment.authenticationServiceUrl}/logout`);
    });

    it('Should call the authentication microservice', () =>
      expect(httpCall.request.method).toEqual('POST'));

    describe('When the authentication microservice answers with a successful response', () => {
      beforeEach(() => httpCall.flush({}));

      it('Should change the store status to completed', () =>
        expect(status$.getLastValue()).toEqual(Status.COMPLETED));
      it('Should remove the user', () =>
        expect(state$.getLastValue()).toEqual(
          expect.objectContaining({ data: null, token: null })
        ));
      it('Should redirect to login', () => expect(routerSpy).toHaveBeenCalledWith(['login']));
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should change the store status to failed', () =>
        expect(status$.getLastValue()).toBe(Status.FAILED));
      it('Should remove the user', () =>
        expect(state$.getLastValue()).toEqual(
          expect.objectContaining({ data: null, token: null })
        ));
      it('Should redirect to login', () => expect(routerSpy).toHaveBeenCalledWith(['login']));
    });
  });

  describe('When the refresh pipe is nexted', () => {
    beforeEach(() => {
      // Flush the SET refresh call
      httpController
        .expectOne(`${environment.authenticationServiceUrl}/refresh`)
        .flush({ token: stubTokenInitial() });

      service.refresh$.next();
      httpCall = httpController.expectOne(`${environment.authenticationServiceUrl}/refresh`);
    });

    it('Should call the authentication microservice', () =>
      expect(httpCall.request.method).toEqual('POST'));
    it('Should set the status to in progress', () =>
      expect(status$.getLastValue()).toBe(Status.IN_PROGRESS));

    describe('When the authentication microservice answers with a successful response', () => {
      beforeEach(() => httpCall.flush({ token: stubTokenRefresh() }));

      it('Should change the store status to completed', () =>
        expect(status$.getLastValue()).toBe(Status.COMPLETED));
      it('Should update the state to contain the updated user', () =>
        expect(state$.getLastValue()).toEqual(
          expect.objectContaining({
            data: stubUser(),
            token: stubTokenRefresh(),
          })
        ));
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should update the store status to failed', () =>
        expect(status$.getLastValue()).toBe(Status.FAILED));
      it('Should remove the user from the state', () =>
        expect(state$.getLastValue()).toEqual(
          expect.objectContaining({ data: null, token: null })
        ));
      it('Should send an error to the toast service', () =>
        expect(toastSpy.receivedNext()).toBeTruthy());
      it('Should redirect to the login screen', () =>
        expect(routerSpy).toHaveBeenCalledWith(['login']));
    });
  });
});

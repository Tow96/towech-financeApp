// Libraries
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopUserService, Status } from './user.service';
// Services
import { environment, provideDesktopEnvironment } from '@finance/desktop/shared/utils-environments';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Mocks
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';
import { DesktopToasterServiceMock } from '@finance/desktop/shared/utils-testing';
// Models
import { LoginUser, UserModel, UserRoles } from '@finance/shared/utils-types';
import { Router } from '@angular/router';

// TODO move this to utils-testing
// ----------------------------------------------------------------------------
const stubLogin = (): LoginUser => ({
  keepSession: false,
  password: 'pass',
  username: 'mail@provider.com',
});

const stubToken = (): string =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJwZXN0byIsImFjY291bnRDb25maXJtZWQiOmZhbHNlLCJtYWlsIjoibWFpbEBwcm92aWRlci5jb20iLCJuYW1lIjoidXNlciIsInJvbGUiOiJ1c2VyIn0.7_4_hjpF-Tw5Xta00TUMwG7O395OE7IUMp0GsfaQoqw';

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
  let state: SubscriberSpy<any>;
  let httpCall: TestRequest;
  let toastService: DesktopToasterService;
  let toastSpy: SubscriberSpy<any>;
  let router: Router;
  let routerSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideStore({ adapt: adaptReducer }),
        DesktopUserService,
        provideDesktopEnvironment(),
        DesktopToasterServiceMock,
      ],
    });
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject<DesktopUserService>(DesktopUserService);
    state = subscribeSpyTo(service.store.state$);
    toastService = TestBed.inject<DesktopToasterService>(DesktopToasterService);
    toastSpy = subscribeSpyTo(toastService.addError$);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');
  });

  it('Should be defined', () => expect(service).toBeTruthy());

  describe('SET', () => {
    beforeEach(
      () => (httpCall = httpController.expectOne(`${environment.authenticationServiceUrl}/refresh`))
    );

    it('Should call the authentication microservice', () =>
      expect(httpCall.request.method).toEqual('POST'));

    it('Should SET a completed state when the microservice returns successful', () => {
      httpCall.flush({ token: stubToken() });
      expect(state.getLastValue()).toEqual({
        data: stubUser(),
        token: stubToken(),
        status: Status.COMPLETED,
      });
    });

    it('Should SET a failed state when the microservice returns failed', () => {
      httpCall.flush(stubError(), stubErrorOpts());
      expect(state.getLastValue()).toEqual({ data: null, token: null, status: Status.FAILED });
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
      expect(state.getLastValue()).toEqual(
        expect.objectContaining({ status: Status.IN_PROGRESS })
      ));

    describe('When the authentication microservice answers with a successful response', () => {
      beforeEach(() => httpCall.flush({ token: stubToken() }));

      it('Should change the store status to completed', () =>
        expect(state.getLastValue()).toEqual(
          expect.objectContaining({ status: Status.COMPLETED })
        ));

      it('Should update the state to contain the new user', () =>
        expect(state.getLastValue()).toEqual(
          expect.objectContaining({
            data: stubUser(),
            token: stubToken(),
          })
        ));

      it('Should redirect to the dashboard', () => expect(routerSpy).toHaveBeenCalledWith(['']));

      it('Should change the isLoggedIn selector to be true', () =>
        isLogged(subscribeSpyTo(service.store.isLoggedIn$).getLastValue(), true, true));
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should update the store status to failed', () =>
        expect(state.getLastValue()).toEqual(expect.objectContaining({ status: Status.FAILED })));

      it('Should send an error to the toast service', () =>
        expect(toastSpy.receivedNext()).toBeTruthy());

      it('Should change the isLoggedIn selector to be false', () =>
        isLogged(subscribeSpyTo(service.store.isLoggedIn$).getLastValue(), true, false));
    });
  });

  describe('When the refresh pipe is nexted', () => {
    beforeEach(() => {
      service.refresh$.next();
      // Gets the latest one since the setup calls the first one
      httpCall = httpController.match(`${environment.authenticationServiceUrl}/refresh`)[1];
    });

    it('Should call the authentication microservice', () =>
      expect(httpCall.request.method).toEqual('POST'));

    describe('When the authentication microservice answers with a successful response', () => {
      beforeEach(() => httpCall.flush({ token: stubToken() }));

      it('Should change the store status to completed', () =>
        expect(state.getLastValue()).toEqual(
          expect.objectContaining({ status: Status.COMPLETED })
        ));

      it('Should update the state to contain the updated user', () =>
        expect(state.getLastValue()).toEqual(
          expect.objectContaining({
            data: stubUser(),
            token: stubToken(),
          })
        ));
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should update the store status to failed', () =>
        expect(state.getLastValue()).toEqual(expect.objectContaining({ status: Status.FAILED })));

      it('Should remove the user from the state', () =>
        expect(state.getLastValue()).toEqual(expect.objectContaining({ data: null, token: null })));

      it('Should send an error to the toast service', () =>
        expect(toastSpy.receivedNext()).toBeTruthy());

      it('Should redirect to the login screen', () =>
        expect(routerSpy).toHaveBeenCalledWith(['login']));
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
        expect(state.getLastValue()).toEqual(
          expect.objectContaining({ status: Status.COMPLETED })
        ));

      it('Should remove the user', () =>
        expect(state.getLastValue()).toEqual(expect.objectContaining({ data: null, token: null })));

      it('Should redirect to login', () => expect(routerSpy).toHaveBeenCalledWith(['login']));
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush(stubError(), stubErrorOpts()));

      it('Should change the store status to failed', () =>
        expect(state.getLastValue()).toEqual(expect.objectContaining({ status: Status.FAILED })));

      it('Should remove the user', () =>
        expect(state.getLastValue()).toEqual(expect.objectContaining({ data: null, token: null })));

      it('Should redirect to login', () => expect(routerSpy).toHaveBeenCalledWith(['login']));

      it('Should send an error to the toast service', () =>
        expect(toastSpy.receivedNext()).toBeTruthy());
    });
  });
});

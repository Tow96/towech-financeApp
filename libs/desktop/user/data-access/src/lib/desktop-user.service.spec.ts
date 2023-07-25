// Libraries
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopUserService, Status } from './desktop-user.service';
// Services
import { environment, provideEnvironment } from '@towech-finance/desktop/environment';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { NewToast } from '@towech-finance/desktop/toasts/utils';
// Mocks
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';
// Models
import { LoginUser, UserModel, UserRoles } from '@towech-finance/shared/utils/models';
import { Router } from '@angular/router';
import { Source } from '@state-adapt/rxjs';

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

const stubError = () => ({ message: 'Invalid', error: 'Unauthorized', statusCode: 401 });

const mockService = {
  addError$: new Source<NewToast>('Test Error Toast'),
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
        provideEnvironment(),
        {
          provide: DesktopToasterService,
          useValue: mockService,
        },
      ],
    });
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DesktopUserService);
    state = subscribeSpyTo(service.store.state$);
    toastService = TestBed.inject<DesktopToasterService>(DesktopToasterService);
    toastSpy = subscribeSpyTo(toastService.addError$);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');
  });

  it('Should be defined', () => expect(service).toBeTruthy());

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
    });

    describe('When the authentication microservice answers with an error', () => {
      beforeEach(() => httpCall.flush({ status: stubError().statusCode, error: stubError() }));

      it('Should update the store status to failed', () =>
        expect(state.getLastValue()).toEqual(expect.objectContaining({ status: Status.FAILED })));

      it('Should send an error to the toast service', () =>
        expect(toastSpy.receivedNext()).toBeTruthy());
    });
  });

  describe('When the refresh pipe is nexted', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Since the initial load already calls the service
      service.refresh$.next();
      httpCall = httpController.expectOne(`${environment.authenticationServiceUrl}/refresh`);
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
      beforeEach(() => httpCall.flush({ status: stubError().statusCode, error: stubError() }));

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
});

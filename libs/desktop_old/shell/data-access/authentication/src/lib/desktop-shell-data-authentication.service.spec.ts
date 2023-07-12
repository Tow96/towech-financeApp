// Libraries
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopAuthenticationService } from './desktop-shell-data-authentication.service';
// Models
import { LoginUser } from '@towech-finance/shared/utils/models';
import {
  DesktopShellUtilsEnvironmentsModule,
  environment,
} from '@towech-finance/desktop/shell/utils/environments';

const stubLogin: LoginUser = {
  keepSession: false,
  password: 'test',
  username: 'test',
};

const stubData = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Q29uZmlybWVkIjpmYWxzZSwibWFpbCI6Impvc2UudG93ZUBnbWFpbC5jb20iLCJuYW1lIjoiVG93Iiwicm9sZSI6ImFkbWluIiwiX2lkIjoiNjQ0OThkNmYyYzQ0MmMyZGJiNjRjOWZmIn0.IrRBnbazZZ5Gb_TxLZOVjZ36RnLxZ5xfKMnjaRrPiKo',
  user: {
    accountConfirmed: false,
    mail: 'jose.towe@gmail.com',
    name: 'Tow',
    role: 'admin',
    _id: '64498d6f2c442c2dbb64c9ff',
  },
};

describe('Authentication Service', () => {
  let service: DesktopAuthenticationService;
  let httpTestingController: HttpTestingController;
  let res: any;
  let req: TestRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DesktopShellUtilsEnvironmentsModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DesktopAuthenticationService);
  });

  it('Should exist', () => expect(service).toBeTruthy());

  describe('When login is called', () => {
    beforeEach(() => {
      service.login(stubLogin).subscribe({ next: data => (res = data), error: e => (res = e) });
      req = httpTestingController.expectOne(`${environment.authenticationServiceUrl}/login`);
      expect(req.request.method).toEqual('POST');
    });

    describe('When the data is correct', () => {
      it('Should call the correct endpoint and return the info', () => {
        req.flush({ token: stubData.token });
        expect(res).toEqual({ token: stubData.token, user: stubData.user });
      });
    });

    describe('When something fails', () => {
      it('Should return the error', () => {
        req.flush('500 error', { status: 500, statusText: 'Unexpected error' });
        expect(res).toEqual('500 error');
      });
    });
  });

  describe('When refresh is called', () => {
    beforeEach(() => {
      service.refresh().subscribe({ next: data => (res = data), error: e => (res = e) });
      req = httpTestingController.expectOne(`${environment.authenticationServiceUrl}/refresh`);
      expect(req.request.method).toEqual('POST');
    });

    describe('When the sent cookie is valid', () => {
      it('Should call the correct endpoint and return the info', () => {
        req.flush({ token: stubData.token });
        expect(res).toEqual({ token: stubData.token, user: stubData.user });
      });
    });

    describe('When something fails', () => {
      it('Should return the error', () => {
        req.flush('500 error', { status: 500, statusText: 'Unexpected error' });
        expect(res).toEqual('500 error');
      });
    });
  });

  describe('When logout is called', () => {
    beforeEach(() => {
      service.logout().subscribe({ next: data => (res = data), error: e => (res = e) });
      req = httpTestingController.expectOne(`${environment.authenticationServiceUrl}/logout`);
      expect(req.request.method).toEqual('POST');
    });

    it('a', () => {
      expect(1).toBe(1);
    });
    describe('When the sent cookie is valid', () => {
      it('Should call the correct endpoint and return the info', () => {
        req.flush({});
        expect(res).toEqual(true);
      });
    });

    describe('When something fails', () => {
      it('Should return the error', () => {
        req.flush('500 error', { status: 500, statusText: 'Unexpected error' });
        expect(res).toEqual('500 error');
      });
    });
  });
});

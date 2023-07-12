/** desktop-shell-data-authentication.service.mock.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Mock for the authentication service
 */
import { Provider } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
// Services
import { DesktopAuthenticationService } from '@towech-finance/desktop/shell/data-access/authentication';
import { UserModel, UserRoles } from '@towech-finance/shared/utils/models';
// Models

export const stubUser = (): UserModel => ({
  _id: '0',
  name: 'TESTINO',
  mail: 'test@mail.com',
  role: UserRoles.USER,
  accountConfirmed: false,
});

export const stubToken = () => 'This definetely is a JWT';

const mockValues = {
  login: jest.fn((): Observable<{ user: UserModel; token: string }> => {
    if (process.env['FAILHTTP']?.toUpperCase() === 'TRUE') {
      return throwError(() => 'TEST ERROR');
    }

    return of({
      token: stubToken(),
      user: stubUser(),
    });
  }),

  refresh: jest.fn((): Observable<{ user: UserModel; token: string }> => {
    if (process.env['FAILHTTP']?.toUpperCase() === 'TRUE') {
      return throwError(() => 'TEST ERROR');
    }

    return of({
      token: stubToken(),
      user: stubUser(),
    });
  }),

  logout: jest.fn((): Observable<boolean> => {
    if (process.env['FAILHTTP']?.toUpperCase() === 'TRUE') {
      return throwError(() => 'TEST ERROR');
    }

    return of(true);
  }),
};

export const MockDesktopAuthenticationService: Provider = {
  provide: DesktopAuthenticationService,
  useValue: mockValues,
};

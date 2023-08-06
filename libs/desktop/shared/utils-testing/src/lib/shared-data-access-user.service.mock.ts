import { Subject, of } from 'rxjs';
import { Action } from '@state-adapt/core';
import { Source } from '@state-adapt/rxjs';
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';

export const fakeUserServiceFire = new Subject<Action<any, '[User Service] Login.error$'>>();

const mockValues = {
  login$: new Source('TEST LOGIN'),
  logout$: new Source('Test Logout'),
  onLoginError$: fakeUserServiceFire.pipe(),
  store: {
    state$: of({
      data: null,
      status: 'Initialized',
      token: null,
    }),
  },
};

export const DesktopUserServiceMock = {
  provide: DesktopUserService,
  useValue: mockValues,
};

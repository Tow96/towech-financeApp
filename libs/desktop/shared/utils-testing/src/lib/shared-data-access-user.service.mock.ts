import { Subject, of } from 'rxjs';
import { Action } from '@state-adapt/core';
import { Source } from '@state-adapt/rxjs';

export const fakeUserServiceFire = new Subject<Action<any, '[User Service] Login.error$'>>();

export const DesktopUserServiceMock = {
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

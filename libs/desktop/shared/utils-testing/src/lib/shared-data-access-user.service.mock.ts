import { Subject } from 'rxjs';
import { Action } from '@state-adapt/core';
import { Source } from '@state-adapt/rxjs';
import { DesktopSharedDataAccessUserService } from '@finance/desktop/shared/data-access-user';

export const fakeUserServiceFire = new Subject<Action<any, '[User Service] Login.error$'>>();

const mockValues = {
  login$: new Source('TEST LOGIN'),
  onLoginError$: fakeUserServiceFire.pipe(),
};

export const DesktopSharedDataAccessUserServiceMock = {
  provide: DesktopSharedDataAccessUserService,
  useValue: mockValues,
};

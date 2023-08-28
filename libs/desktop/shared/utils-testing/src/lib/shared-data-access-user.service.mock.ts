import { Subject } from 'rxjs';
import { Action } from '@state-adapt/core';

export const fakeUserServiceFire = new Subject<Action<any, '[User Service] Login.error$'>>();

export const DesktopUserServiceMock = {
  login: () => {}, //eslint-disable-line
  logout: () => {}, //eslint-disable-line
};

/** desktop-user.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service that handles the user state
 */
// Libraries
import { Injectable } from '@angular/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source, toSource } from '@state-adapt/rxjs';
import { catchError, map, of } from 'rxjs';
// Services
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// State adapt
import { adapter, initialState } from './user.adapter';
// Models
import { LoginUser } from '@finance/shared/utils-types';
import { Status } from './types';
// Pipes
import { loginCall, logoutCall, postRefresh$, refreshCall } from './auth.api';
import { customSplit } from './api.utils';

export enum Actions {
  LOGIN = '[User Service] Login',
  LOGOUT = '[User Service] Logout',
  REFRESH = '[User Service] Refresh',
}

@Injectable()
export class DesktopUserService {
  private storeName = 'user';

  // Sources ---------------------------------------------------------
  login$ = new Source<LoginUser>(Actions.LOGIN);
  logout$ = new Source<void>(Actions.LOGOUT);
  refresh$ = new Source<void>(Actions.REFRESH);

  // Helpers -------------------------------------------------------
  private initialLoad$ = postRefresh$().pipe(
    map(res => ({ data: res.user, token: res.token, status: Status.COMPLETED })),
    catchError(() => of({ ...initialState, status: Status.FAILED })),
    toSource('[User Service] initial load')
  );

  onLogin = customSplit(Actions.LOGIN, this.login$.pipe(loginCall(Actions.LOGIN)));
  onLogout = customSplit(Actions.LOGOUT, this.logout$.pipe(logoutCall(Actions.LOGOUT)));
  onRefresh = customSplit(Actions.REFRESH, this.refresh$.pipe(refreshCall(Actions.REFRESH)));

  // private onRefreshSucess$ = this.handleRefresh.success$.pipe();
  // private onRefreshError$ = this.handleRefresh.error$.pipe(
  //   tap(error => {
  //     this.router.navigate(['login']);
  //     this.toast.addError$.next({ message: error.payload.message });
  //   })
  // );

  // Store ---------------------------------------------------------
  store = adaptNgrx([this.storeName, initialState, adapter], {
    set: this.initialLoad$,
    clearUser: [this.onLogout.error$, this.onLogout.success$, this.onRefresh.error$],
    setUser: [this.onLogin.success$, this.onRefresh.success$],
    setStatusComplete: [this.onLogin.success$, this.onLogout.success$, this.onRefresh.success$],
    setStatusFailed: [this.onLogin.error$, this.onLogout.error$, this.onRefresh.error$],
    setStatusInProgress: [this.login$, this.refresh$],
  });

  constructor(
    protected readonly http: HttpClient,
    protected readonly toast: DesktopToasterService,
    protected readonly router: Router
  ) {}
}

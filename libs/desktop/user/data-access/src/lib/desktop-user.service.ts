/** desktop-user.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service that handles the user state
 */
// Libraries
import { Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source, splitRequestSources, toSource } from '@state-adapt/rxjs';
import { exhaustMap, map, share, tap } from 'rxjs';
// Services
import { DesktopAuthenticationService } from './authentication.service';
// Models
import { LoginUser, UserModel } from '@towech-finance/shared/utils/models';

enum Actions {
  LOGIN = '[User Service] Login',
  LOGOUT = '[User Service] Logout',
  REFRESH = '[User Service] Refresh',
}

export enum Status {
  INIT = 'initialized',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface state {
  data: UserModel | null;
  status: Status;
  token: string | null;
}

@Injectable()
export class DesktopUserService extends DesktopAuthenticationService {
  private storeName = 'user';
  private initialState: state = {
    data: null,
    status: Status.INIT,
    token: null,
  };

  // Sources ---------------------------------------------------------
  public login$ = new Source<LoginUser>(Actions.LOGIN);
  public logout$ = new Source<void>(Actions.LOGOUT);
  public refresh$ = new Source<void>(Actions.REFRESH);

  // Helpers -------------------------------------------------------
  private handleLogin = splitRequestSources(
    Actions.LOGIN,
    this.login$.pipe(exhaustMap(action => this.callLogin(action.payload, Actions.LOGIN)))
  );
  private handleRefresh = splitRequestSources(
    Actions.REFRESH,
    this.refresh$.pipe(exhaustMap(() => this.callRefresh(Actions.REFRESH)))
  );
  private handleLogout = splitRequestSources(
    Actions.LOGOUT,
    this.logout$.pipe(exhaustMap(() => this.callLogout(Actions.LOGOUT)))
  );

  // Pipes ------------------------------------------------------------
  private initialLoad$ = this.callRefresh('').pipe(
    map(({ payload, type }) => {
      if (type === '.success$')
        return { data: payload.user, token: payload.token, status: Status.COMPLETED };
      return { ...this.initialState, status: Status.FAILED };
    }),
    toSource('[User Service] initial load')
  );

  private onLoginSuccess$ = this.handleLogin.success$.pipe(tap(() => this.router.navigate([''])));
  public onLoginError$ = this.handleLogin.error$.pipe(
    tap(error => this.toast.addError$.next({ message: error.payload.message })),
    share()
  );

  private onRefreshSucess$ = this.handleRefresh.success$.pipe();
  private onRefreshError$ = this.handleRefresh.error$.pipe(
    tap(error => {
      this.router.navigate(['login']);
      this.toast.addError$.next({ message: error.payload.message });
    })
  );

  private onLogoutSuccess$ = this.handleLogout.success$.pipe(
    tap(() => this.router.navigate(['login']))
  );
  private onLogoutError$ = this.handleLogout.error$.pipe(
    tap(() => this.router.navigate(['login'])),
    tap(({ payload }) => this.toast.addError$.next({ message: payload }))
  );

  // Adapter -------------------------------------------------------
  private adapter = createAdapter<state>()({
    clearUser: state => ({ ...state, data: null, token: null }),
    setUser: (state, value): state => ({ ...state, data: value.user, token: value.token }),
    setStatusComplete: state => ({ ...state, status: Status.COMPLETED }),
    setStatusFailed: state => ({ ...state, status: Status.FAILED }),
    setStatusInProgress: state => ({ ...state, status: Status.IN_PROGRESS }),
    selectors: {
      isLoggedIn: user => ({
        loaded: user.status === Status.COMPLETED || user.status === Status.FAILED,
        logged: user.data !== null,
      }),
    },
  });

  // Store ---------------------------------------------------------
  public store = adaptNgrx([this.storeName, this.initialState, this.adapter], {
    set: this.initialLoad$,
    clearUser: [this.onRefreshError$, this.onLogoutSuccess$, this.onLogoutError$],
    setUser: [this.onLoginSuccess$, this.onRefreshSucess$],
    setStatusComplete: [this.onLoginSuccess$, this.onRefreshSucess$, this.onLogoutSuccess$],
    setStatusFailed: [this.onLoginError$, this.onRefreshError$, this.onLogoutError$],
    setStatusInProgress: this.login$,
  });
}

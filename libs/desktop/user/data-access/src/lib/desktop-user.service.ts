/** desktop-user.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service that handles the user state
 */
// Libraries
import { Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source, toRequestSource, splitRequestSources, toSource } from '@state-adapt/rxjs';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
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

interface state {
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
    this.login$.pipe(
      exhaustMap(action => this.login(action.payload).pipe(toRequestSource(Actions.LOGIN)))
    )
  );
  private handleRefresh = splitRequestSources(
    Actions.REFRESH,
    this.refresh$.pipe(exhaustMap(action => this.refresh().pipe(toRequestSource(Actions.REFRESH))))
  );

  // Pipes ------------------------------------------------------------
  private loginSuccess$ = this.handleLogin.success$.pipe(tap(() => this.router.navigate([''])));
  private loginError$ = this.handleLogin.error$.pipe(
    tap(error => this.toast.addError$.next({ message: error.payload.message }))
  );

  private refreshSucess$ = this.handleRefresh.success$.pipe();
  private refreshError$ = this.handleRefresh.error$.pipe(
    tap(error => {
      this.router.navigate(['login']);
      this.toast.addError$.next({ message: error.payload.message });
    })
  );

  // private initialLoad$ = this.refresh().pipe(
  //   map(res => ({ data: res.user, token: res.token, status: Status.COMPLETED })),
  //   catchError(() => of({ ...this.initialState, status: Status.FAILED })),
  //   toSource('[User Service] initial load')
  // );

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
    clearUser: this.refreshError$,
    setUser: [this.loginSuccess$, this.refreshSucess$],
    setStatusComplete: [this.loginSuccess$, this.refreshSucess$],
    setStatusFailed: [this.loginError$, this.refreshError$],
    setStatusInProgress: this.login$,
  });
}

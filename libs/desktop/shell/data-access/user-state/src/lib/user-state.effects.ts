/** user-state.effects.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Effects that are triggered in the user state
 */
// Libraries
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator } from '@ngrx/store';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
// Services
import { DesktopAuthenticationService } from '@towech-finance/desktop/shell/data-access/authentication';
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
// NGRX
import * as userActions from './user-state.actions';
// Models
import { LoginUser } from '@towech-finance/shared/utils/models';

@Injectable()
export class UserEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly authApi: DesktopAuthenticationService,
    private readonly router: Router,
    private readonly toast: DesktopToasterService
  ) {}

  // Effects ----------------------------------------------------------------------
  public initialLoad = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => userActions.refreshToken()) // eslint-disable-line max-nested-callbacks
    )
  );

  public errorEffect = createEffect(() => this.handleError$(), { dispatch: false });

  public login = createEffect(() => this.handleLogin$());
  public refresh = createEffect(() => this.handleRefresh$());

  public redirectToHome = createEffect(() => this.handleRedirectToHome$(), { dispatch: false });
  public redirectToLogin = createEffect(() => this.handleRedirectToLogin$(), { dispatch: false });

  // Pipes ------------------------------------------------------------------------
  private handleError$(): Observable<void> {
    return this.actions$.pipe(
      ofType(userActions.loginFailure),
      map(action => this.toast.add(action.message))
    );
  }

  private handleLogin$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(userActions.login),
      switchMap(action => this.resolveLoginCall$(action.credentials))
    );
  }

  private resolveLoginCall$(credentials: LoginUser): Observable<Action> {
    return this.authApi.login(credentials).pipe(
      map(res => userActions.loginSuccess({ token: res.token, user: res.user })),
      catchError(err => this.returnFailure$(err, userActions.loginFailure, 'Failed to Login'))
    );
  }

  private handleRefresh$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(userActions.refreshToken),
      switchMap(() => this.resolveRefreshCall$())
    );
  }

  private resolveRefreshCall$(): Observable<Action> {
    return this.authApi.refresh().pipe(
      map(res => userActions.refreshTokenSuccess({ token: res.token, user: res.user })),
      catchError(() => of(userActions.refreshTokenFailure()))
    );
  }

  private handleRedirectToHome$(): Observable<void> {
    return this.actions$.pipe(
      ofType(userActions.loginSuccess, userActions.refreshTokenSuccess),
      map(() => {
        this.router.navigate(['']);
      })
    );
  }

  private handleRedirectToLogin$(): Observable<void> {
    return this.actions$.pipe(
      ofType(userActions.refreshTokenFailure),
      map(() => {
        this.router.navigate(['login']);
      })
    );
  }

  /*eslint-disable @typescript-eslint/no-explicit-any*/
  private returnFailure$(
    e: any,
    action: ActionCreator<any, any>,
    defaultMsg: string
  ): Observable<Action> {
    return of(action({ message: e.message || defaultMsg }));
  }
  /*eslint-enable @typescript-eslint/no-explicit-any*/
}

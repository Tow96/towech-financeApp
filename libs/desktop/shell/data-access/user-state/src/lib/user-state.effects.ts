/** user-state.effects.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Effects that are triggered in the user state
 */
// Libraries
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
  public errorEffect = createEffect(() => this.handleError$(), { dispatch: false });

  public login = createEffect(() => this.handleLogin$());

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
      map(res => {
        this.router.navigate(['']);
        return userActions.loginSuccess({ token: res.token, user: res.user });
      }),
      catchError(err => this.returnFailure$(err, userActions.loginFailure, 'Failed to Login'))
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

import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginActions, logoutActions, refreshActions } from './user.actions';
import { loginCall, logoutCall, refreshCall } from './auth.api';
import { HttpClient } from '@angular/common/http';

export const loginEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(ofType(loginActions.do), loginCall(http)),
  { functional: true }
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(ofType(logoutActions.do), logoutCall(http)),
  { functional: true }
);

export const refreshEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(ofType(refreshActions.do), refreshCall(http)),
  { functional: true }
);

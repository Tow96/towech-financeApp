import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginActions, logoutActions, refreshActions } from './user.actions';
import { loginCall, logoutCall, refreshCall } from './auth.api';

export const loginEffect = createEffect(
  (actions$ = inject(Actions)) => actions$.pipe(ofType(loginActions.do), loginCall()),
  { functional: true }
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions)) => actions$.pipe(ofType(logoutActions.do), logoutCall()),
  { functional: true }
);

export const refreshEffect = createEffect(
  (actions$ = inject(Actions)) => actions$.pipe(ofType(refreshActions.do), refreshCall()),
  { functional: true }
);

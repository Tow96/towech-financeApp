/** rxjs.utils.ts
 * Copyright (c) 2023, Towechlabs
 *
 * File that contains common calls for rxjs
 */
// Libraries
import { inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
// Services
import { Router } from '@angular/router';
import { ActionCreator, Creator, createAction, props } from '@ngrx/store';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';

export interface ApiPayload<T> {
  payload: T;
}
export interface ApiAction<T> extends ApiPayload<T> {
  type: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Use empty props if genric is undefined or unknown
export function createApiCallActions<D, S>(source: string, type: string) {
  return {
    do: createAction(`[${source}] ${type}`, props<ApiPayload<D>>()),
    success: createAction(`[${source}] ${type} success`, props<ApiPayload<S>>()),
    failure: createAction(`[${source}] ${type} failure`, props<ApiPayload<string>>()),
  };
}

export function navigateTo<A>(path: string, router = inject(Router)) {
  return (source$: Observable<A>): Observable<A> =>
    source$.pipe(tap(() => router.navigate([path])));
}
export function toastError<T>(
  e: any,
  defaultMsg = 'Unexpected Error',
  toaster?: DesktopToasterService
) {
  return (source$: Observable<T>): Observable<T> =>
    source$.pipe(
      tap(() => {
        if (toaster) toaster.addError(e.message || defaultMsg);
      })
    );
}
export function toastSuccess<T>(msg: string, toast: DesktopToasterService) {
  return (source$: Observable<T>): Observable<T> => source$.pipe(tap(() => toast.addSuccess(msg)));
}
export function toAction<T>(action: ActionCreator<string, Creator<any[], ApiAction<T>>>) {
  return (source$: Observable<T>): Observable<ApiAction<T>> =>
    source$.pipe(map(res => action({ payload: res })));
}

export function catchAction(
  action: ActionCreator<string, any>,
  defaultMsg?: string,
  toaster?: DesktopToasterService
) {
  return (source$: Observable<any>): Observable<ApiAction<string>> =>
    source$.pipe(
      catchError(e =>
        of(action({ payload: e.message || defaultMsg })).pipe(toastError(e, defaultMsg, toaster))
      )
    );
}

export function toApiResponse<T>(
  action: { success: ActionCreator<string, any>; failure: ActionCreator<string, any> },
  defaultMsg?: string,
  toastOnError?: DesktopToasterService
) {
  return (source$: Observable<T>): Observable<ApiAction<T | string>> =>
    source$.pipe(toAction(action.success), catchAction(action.failure, defaultMsg, toastOnError));
}

export function catchAndRedirectAction(
  action: ActionCreator<string, any>,
  destination: string,
  defaultMsg?: string,
  router = inject(Router)
) {
  return (source$: Observable<any>): Observable<ApiAction<string>> =>
    source$.pipe(
      catchError(e =>
        of(action({ payload: e.message || defaultMsg })).pipe(
          toastError(e, defaultMsg),
          navigateTo(destination, router)
        )
      )
    );
}

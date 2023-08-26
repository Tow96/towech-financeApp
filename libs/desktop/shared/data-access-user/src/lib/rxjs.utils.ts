/** rxjs.utils.ts
 * Copyright (c) 2023, Towechlabs
 *
 * File that contains common calls for rxjs
 */
// Libraries
import { inject } from '@angular/core';
import { Action } from '@state-adapt/core';
import { Observable, catchError, of, tap } from 'rxjs';
// Services
import { Router } from '@angular/router';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Pipes
import { toSource } from '@state-adapt/rxjs';

export type Prefix = string;
export type PrefixOutputs = `${Prefix}.success$` | `${Prefix}.error$` | `${Prefix}.cached$`;

export function navigateTo<A>(path: string, router = inject(Router)) {
  return (source$: Observable<A>): Observable<A> =>
    source$.pipe(tap(() => router.navigate([path])));
}

export function toSuccessSource<A>(typePrefix: Prefix) {
  return (source$: Observable<A>): Observable<Action<A, `${Prefix}.success$`>> =>
    source$.pipe(toSource(`${typePrefix}.success$`));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function catchToastAndRedirectSource<P>(
  typePrefix: Prefix,
  destination: string,
  defaultMsg = 'Unexpected Error',
  router = inject(Router),
  toast = inject(DesktopToasterService)
) {
  return (source$: Observable<P>): Observable<P | Action<any, `${Prefix}.error$`>> =>
    source$.pipe(
      catchError(e =>
        of(toast.addError$.next({ message: e.message || defaultMsg })).pipe(
          navigateTo(destination, router),
          toSource(`${typePrefix}.error$`)
        )
      )
    );
}

export function catchAndToastSource<P>(
  typePrefix: Prefix,
  defaultMsg = 'Unexpected Error',
  toast = inject(DesktopToasterService)
) {
  return (source$: Observable<P>): Observable<P | Action<any, `${Prefix}.error$`>> =>
    source$.pipe(
      catchError(e =>
        of(toast.addError$.next({ message: e.message || defaultMsg })).pipe(
          toSource(`${typePrefix}.error$`)
        )
      )
    );
}
/* eslind-enable */

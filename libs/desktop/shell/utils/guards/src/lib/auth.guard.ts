/** auth.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Guard that checks if the user is logged in
 */
// Libraries
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserSelectors } from '@towech-finance/desktop/shell/data-access/user-state';
import { filter, map, Observable } from 'rxjs';

@Injectable()
export class AuthGuard {
  public constructor(private readonly router: Router, private readonly store: Store) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  public canActivate(): Observable<boolean> {
    return this.store.select(UserSelectors.isLoggedIn).pipe(
      filter(logState => logState.loaded),
      map(logState => {
        if (!logState.loggedIn) this.router.navigate(['login']);

        return logState.loggedIn;
      })
    );
  }
}

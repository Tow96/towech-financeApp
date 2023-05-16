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
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthGuard {
  constructor(private readonly router: Router, private readonly store: Store) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  canActivate(): Observable<boolean> {
    return this.store.select(UserSelectors.selectUser).pipe(
      map(user => {
        const isLoggedIn = user ? true : false;
        if (!isLoggedIn) {
          this.router.navigate(['login']);
        }
        return isLoggedIn;
      })
    );
  }
}

/** auth.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Guard that checks if the user is logged in
 */
// Libraries
import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
// Services
import { Router } from '@angular/router';
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';

@Injectable()
export class DesktopUserAuthGuard {
  public constructor(
    private readonly router: Router,
    private readonly user: DesktopUserService
  ) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  public canActivate(): Observable<boolean> {
    return this.user.store.isLoggedIn$.pipe(
      filter(isLoggedIn => isLoggedIn.loaded),
      map(isLoggedIn => {
        if (!isLoggedIn.logged) this.router.navigate(['login']);
        return isLoggedIn.logged;
      })
    );
  }
}

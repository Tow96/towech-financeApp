/** auth.guard.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Guard that checks if the user is logged in
 */
// Libraries
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
// Services
import { Router } from '@angular/router';
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';

@Injectable()
export class DesktopUserAuthGuard {
  public constructor(
    private readonly router: Router,
    private readonly user: DesktopUserService
  ) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  public canActivate(): Observable<boolean> {
    return this.user.store.isLoggedIn$.pipe(
      map(logged => {
        if (!logged) this.router.navigate(['login']);
        return logged;
      })
    );
  }
}
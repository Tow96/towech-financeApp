/** desktop-user.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service that handles the user state
 */
// Libraries
import { Injectable } from '@angular/core';
import { createAdapter } from '@state-adapt/core';
import { adaptNgrx } from '@state-adapt/ngrx';
import { Source, toSource } from '@state-adapt/rxjs';
// Models
import { LoginUser, UserModel } from '@towech-finance/shared/utils/models';

@Injectable()
export class DesktopUserService {
  private storeName = 'user';
  private initialState: UserModel | null = null;

  // Pipes ---------------------------------------------------------
  public login$ = new Source<LoginUser>('[User Service] Login');
  public logout$ = new Source<void>('[Navbar] Logout');
  // public refreshToken$ = timer(1000).pipe(
  //   map(() => new UserModel('-1', 'test', 'test@mail.com', UserRoles.USER, true)),
  //   toSource('[User Service] Refresh Token')
  // );

  // Adapter -------------------------------------------------------
  private adapter = createAdapter<UserModel | null>()({
    selectors: {
      isLoggedIn: user => user !== null,
    },
  });

  // Store ---------------------------------------------------------
  public store = adaptNgrx([this.storeName, this.initialState, this.adapter], {
    // set: this.refreshToken$,
  });

  // Helpers -------------------------------------------------------
}

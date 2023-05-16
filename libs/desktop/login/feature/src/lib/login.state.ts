import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DesktopAuthenticationService } from '@towech-finance/desktop/shell/data-access/authentication';
import { LoginUser, UserModel } from '@towech-finance/shared/utils/models';
// import { EMPTY, Observable, catchError, map, of, switchMap } from 'rxjs';
import { catchError, Observable, switchMap, map, of } from 'rxjs';

export interface LoginState {
  loading: boolean;
}

@Injectable()
export class LoginStore extends ComponentStore<LoginState> {
  constructor(private readonly authService: DesktopAuthenticationService) {
    super({ loading: false });
  }

  // Selectors
  public loading$ = this.select(state => state.loading);

  // Effects
  public login = this.effect(
    (credentials$: Observable<LoginUser>): Observable<UserModel> => this.login$(credentials$)
  );

  // ---------------------------------------------------------------
  private login$(credentials$: Observable<LoginUser>): Observable<UserModel> {
    return credentials$.pipe(switchMap(credentials => this.handleLoginCall$(credentials)));
  }

  private handleLoginCall$(credentials: LoginUser): Observable<UserModel> {
    return this.authService.login(credentials).pipe(
      map(res => res),
      catchError(err => of(err))
    );
  }
}

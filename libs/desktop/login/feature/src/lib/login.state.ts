import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  DesktopAuthenticationService,
  LoginCredentials,
} from '@towech-finance/desktop/shell/data-access/authentication';
import { EMPTY, Observable, catchError, map, of, switchMap, tap } from 'rxjs';

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
  login = this.effect((credentials$: Observable<LoginCredentials>) =>
    credentials$.pipe(
      switchMap(credentials =>
        this.authService.login(credentials).pipe(
          map(res => {
            console.log(res);
          }),
          catchError(err => of(console.log(err)))
        )
      ),
      catchError(() => EMPTY)
    )
  );
}

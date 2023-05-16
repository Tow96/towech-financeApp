import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DesktopAuthenticationService } from '@towech-finance/desktop/shell/data-access/authentication';
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
  /* eslint-disable max-nested-callbacks */
  login = this.effect((credentials$: Observable<any>) =>
    credentials$.pipe(
      switchMap(credentials =>
        this.authService
          .login({
            keepSession: true,
            password: 'oh4r7pqk',
            username: 'jose.towe@gmail.com',
          })
          .pipe(
            map(res => {
              console.log(res);
            }),
            catchError(err => of(console.log(err)))
          )
      )
    )
  );
}

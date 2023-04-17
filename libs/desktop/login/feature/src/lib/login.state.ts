import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, tap } from 'rxjs';

export interface LoginState {
  loading: boolean;
}

interface LoginCredentials {
  username?: string | null;
  password?: string | null;
}

@Injectable()
export class LoginStore extends ComponentStore<LoginState> {
  // Selectors
  public loading$ = this.select(state => state.loading);

  // Effects
  login = this.effect((credentials$: Observable<LoginCredentials>) =>
    credentials$.pipe(
      tap(() => {
        console.log('Logging Effect');
      })
    )
  );
}

/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
// NGRX
import { UserActions } from '@towech-finance/desktop/shell/data-access/user-state';

@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onLoginFormSubmit()">
        <input type="text" formControlName="username" placeholder="Username" />
        <input type="password" formControlName="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  `,
})
export class DesktopLoginComponent {
  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    keepSession: [false],
  });

  constructor(private readonly fb: FormBuilder, private readonly store: Store) {}

  onLoginFormSubmit() {
    const value = this.loginForm.value;
    this.store.dispatch(
      UserActions.login({
        credentials: {
          keepSession: value.keepSession || false,
          password: value.password || '',
          username: value.username || '',
        },
      })
    );
  }
}

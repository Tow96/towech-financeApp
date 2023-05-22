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
// Components
import { DesktopToasterComponent } from '@towech-finance/desktop/toasts/tray';

// TODO: Testing
@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, DesktopToasterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <towech-finance-toaster></towech-finance-toaster>
    <div class="login-container">
      <h1>Login</h1>
      <form [formGroup]="loginForm" (ngSubmit)="onLoginFormSubmit()">
        <div>
          <input type="text" formControlName="username" placeholder="Username" />
        </div>
        <div>
          <input type="password" formControlName="password" placeholder="Password" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
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

    console.log(this.loginForm);
    // this.store.dispatch(
    //   UserActions.login({
    //     credentials: {
    //       keepSession: value.keepSession || false,
    //       password: value.password || '',
    //       username: value.username || '',
    //     },
    //   })
    // );
  }
}

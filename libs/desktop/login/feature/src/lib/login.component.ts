import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginStore } from './login.state';

@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  imports: [ReactiveFormsModule],
  providers: [LoginStore],
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
  });

  constructor(private readonly fb: FormBuilder, private readonly loginStore: LoginStore) {}

  onLoginFormSubmit() {
    this.loginStore.login(this.loginForm.value);
  }
}

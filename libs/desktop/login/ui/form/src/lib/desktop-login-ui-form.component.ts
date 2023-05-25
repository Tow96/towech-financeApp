/** desktop-login-ui-form.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * UI for the login form
 */
// Libraries
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedInputComponent } from '@towech-finance/shared/ui/input';
import { Actions, FormGroupState, NgrxFormsModule, createFormGroupState } from 'ngrx-forms';

@Component({
  standalone: true,
  selector: 'towech-finance-login-form',
  imports: [NgrxFormsModule, SharedInputComponent],
  template: `
    <form novalidate [ngrxFormState]="form" (submit)="onSubmit()">
      <towech-finance-shared-input
        label="Username"
        [ngrxFormControlState]="form.controls.username"
        (ngrxFormsAction)="updateForm($event)">
      </towech-finance-shared-input>
      <towech-finance-shared-input
        label="Password"
        type="password"
        [ngrxFormControlState]="form.controls.password"
        (ngrxFormsAction)="updateForm($event)">
      </towech-finance-shared-input>
      <button type="submit">Login</button>
    </form>
  `,
})
export class LoginFormComponent {
  @Input() public form: FormGroupState<{
    username: string;
    password: string;
    keepSession: boolean;
  }> = createFormGroupState('loginForm', { username: '', password: '', keepSession: false });
  @Output() public updated = new EventEmitter<Actions<string>>();
  @Output() public submitted = new EventEmitter<void>();

  public onSubmit(): void {
    this.submitted.next();
  }

  public updateForm(event: Actions<string>) {
    this.updated.next(event);
  }
}

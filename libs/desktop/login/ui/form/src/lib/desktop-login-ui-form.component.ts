/** desktop-login-ui-form.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * UI for the login form
 */
// Libraries
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Actions, FormGroupState, NgrxFormsModule, createFormGroupState } from 'ngrx-forms';
// Components
import { ButtonComponent } from '@towech-finance/shared/ui/button';
import { SharedCheckboxComponent } from '@towech-finance/shared/ui/checkbox';
import { SharedInputComponent } from '@towech-finance/shared/ui/input';

@Component({
  standalone: true,
  selector: 'towech-finance-login-form',
  styleUrls: ['./desktop-login-ui-form.component.scss'],
  // imports: [NgrxFormsModule, SharedInputComponent, ButtonComponent, SharedCheckboxComponent],
  template: `
    <!-- <form novalidate [ngrxFormState]="form" (submit)="onSubmit()">
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
      <div class="bottom-row">
        <towech-finance-checkbox
          label="Keep Session"
          [ngrxFormControlState]="form.controls.keepSession"
          (ngrxFormsAction)="updateForm($event)">
        </towech-finance-checkbox>
        <towech-finance-button type="submit">Login</towech-finance-button>
      </div>
    </form> -->
  `,
})
export class LoginFormComponent {
  // @Input() public form: FormGroupState<{
  //   username: string;
  //   password: string;
  //   keepSession: boolean;
  // }> = createFormGroupState('loginForm', { username: '', password: '', keepSession: false });
  // @Output() public updated = new EventEmitter<Actions<string> | Actions<boolean>>();
  // @Output() public submitted = new EventEmitter<void>();
  // public onSubmit(): void {
  //   this.submitted.next();
  // }
  // public updateForm(event: Actions<string> | Actions<boolean>) {
  //   this.updated.next(event);
  // }
}

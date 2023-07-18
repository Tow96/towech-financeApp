/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, Component, Directive, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Source, toSource } from '@state-adapt/rxjs';
import { adaptNgrx } from '@state-adapt/ngrx';
// Services
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';
// Modules
import { AsyncPipe } from '@angular/common';
// Models
import { LoginUser } from '@towech-finance/shared/utils/models';
import { createAdapter } from '@state-adapt/core';
import { ButtonComponent } from '@towech-finance/shared/ui/button';
import { SharedCheckboxComponent } from '@towech-finance/shared/ui/checkbox';
import { SharedInputComponent } from '@towech-finance/shared/ui/input';

// TODO: Move this into its own library when more forms are created -----------
export type IForm<T> = {
  [K in keyof T]: AbstractControl<T[K] | null>;
};

@Directive({
  selector: '[patchFormGroupValues]', // eslint-disable-line @angular-eslint/directive-selector
  standalone: true,
})
export class PatchFormGroupValuesDirective<T> {
  @Input() public formGroup?: FormGroup<IForm<T>>;
  @Input()
  public set patchFormGroupValues(val: T | undefined) {
    if (!this.formGroup || !val) return;
    this.formGroup.patchValue(val, { emitEvent: false });
  }
}
// ----------------------------------------------------------------------------

@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  styleUrls: ['./login.component.scss'],
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    PatchFormGroupValuesDirective,
    SharedInputComponent,
    ButtonComponent,
    SharedCheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-container">
      <h1>Login</h1>
      <form
        [formGroup]="form"
        [patchFormGroupValues]="store.state$ | async"
        (submit)="login$.next()">
        <towech-finance-shared-input label="Username" formControlName="username">
        </towech-finance-shared-input>
        <towech-finance-shared-input type="password" label="Password" formControlName="password">
        </towech-finance-shared-input>
        <div class="bottom-row">
          <towech-finance-checkbox label="Keep Session" formControlName="keepSession">
          </towech-finance-checkbox>
          <towech-finance-button type="submit" id="Login-button">Login</towech-finance-button>
        </div>
      </form>
    </div>
  `,
})
export class DesktopLoginComponent {
  private storeName = 'login';
  private initialState: LoginUser = {
    keepSession: false,
    password: '',
    username: '',
  };

  public form = new FormGroup<IForm<LoginUser | null>>({
    keepSession: new FormControl(this.initialState.keepSession),
    password: new FormControl(this.initialState.password, { validators: [Validators.required] }),
    username: new FormControl(this.initialState.username, { validators: [Validators.required] }),
  });

  // Pipes --------------------------------------------------------------------
  private valueChanges$ = this.form.valueChanges.pipe(toSource('[Login Page] Form change'));
  public login$ = new Source<void>('[Login Page] Trigger Login');

  // Adapter ------------------------------------------------------------------
  private adapter = createAdapter<LoginUser>()({
    changeValue: (state, value) => ({ ...state, ...value }),
    login: state => this.triggerLogin(state),
  });

  // Store --------------------------------------------------------------------
  public store = adaptNgrx([this.storeName, this.initialState, this.adapter], {
    changeValue: this.valueChanges$,
    login: this.login$,
  });

  // Helpers ------------------------------------------------------------------
  private triggerLogin(state: LoginUser): LoginUser {
    console.log('qqq');
    // Triggers the pipe rather than being the pipe itself to avoid circular imports
    this.user.login$.next(state);
    return state;
  }

  public constructor(public readonly user: DesktopUserService) {}
}

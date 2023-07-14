/** login.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Login Feature component
 */
// Libraries
import { ChangeDetectionStrategy, Component, Directive, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Source, toSource } from '@state-adapt/rxjs';
import { adaptNgrx } from '@state-adapt/ngrx';
import { map, of } from 'rxjs';
// Modules
import { AsyncPipe, NgIf } from '@angular/common';
// Components
import { DesktopToasterComponent } from '@towech-finance/desktop/toasts/tray';
// Models
import { LoginUser } from '@towech-finance/shared/utils/models';
import { createAdapter } from '@state-adapt/core';
// import { LoginFormComponent } from '@towech-finance/desktop/login/ui/form';
// NGRX
// import { LoginStore } from './login.store';

@Directive({
  selector: '[patchFormGroupValues]', // eslint-disable-line @angular-eslint/directive-selector
  standalone: true,
})
export class PatchFormGroupValuesDirective {
  @Input() public formGroup: any;
  @Input()
  public set patchFormGroupValues(val: any) {
    if (!val) return;
    this.formGroup.patchValue(val, { emitEvent: false });
  }
}

@Directive({
  selector: '[setValue]',
  standalone: true,
})
export class SetValueDirective {
  @Input()
  public set setValue(val: any) {
    this.ngControl.control?.setValue(val, { emitEvent: false });
  }

  public constructor(private ngControl: NgControl) {}
}

@Component({
  standalone: true,
  selector: 'towech-finance-webclient-dashboard',
  styleUrls: ['./login.component.scss'],
  // providers: [LoginStore],
  imports: [
    AsyncPipe,
    NgIf,
    DesktopToasterComponent,
    ReactiveFormsModule,
    SetValueDirective,
    PatchFormGroupValuesDirective,
  ],
  // imports: [AsyncPipe, NgIf, DesktopToasterComponent, LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <towech-finance-toaster></towech-finance-toaster>
    <div class="login-container">
      <!-- <div class="login-container" *ngIf="store.form$ | async as form"> -->
      <h1>Login</h1>
      <form [formGroup]="form" [patchFormGroupValues]="store.state$ | async">
        <!-- <input type="text" [formControl]="username" [setValue]="store.username$ | async" />
      <input type="text" />
      <input type="checkbox" /> -->
        <input type="text" formControlName="username" />
        <input type="text" formControlName="password" />
        <input type="checkbox" formControlName="keepSession" />
      </form>
      <button (click)="pesto$.next()">qqqqq</button>
      <!-- <towech-finance-login-form
        [form]="form"
        (submitted)="onLoginFormSubmit()"
        (updated)="store.handleFormAction($event)">
      </towech-finance-login-form> -->
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

  // public keepSession = new FormControl(this.initialState.keepSession);
  // public password = new FormControl(this.initialState.password);
  // public username = new FormControl(this.initialState.username);

  public form = this.fb.group({
    keepSession: [this.initialState.keepSession],
    password: [this.initialState.password, Validators.required],
    username: [this.initialState.username, Validators.required],
  });

  // Pipes --------------------------------------------------------------------
  // private keepSessionChange$ = this.keepSession.valueChanges.pipe(toSource('[Form] Keep Change'));
  // private usernameChange$ = this.username.valueChanges.pipe(toSource('[Form] Name Change'));
  // private passwordChange$ = this.password.valueChanges.pipe(toSource('[Form] Pass Change'));
  private valueChanges$ = this.form.valueChanges.pipe(toSource('[Login] form change'));
  public pesto$ = new Source<void>('[Login] test');

  // Adapter ------------------------------------------------------------------
  private adapter = createAdapter<LoginUser>()({
    changeValue: (state, value) => ({ ...state, ...value }),
    pesto: () => ({ ...this.initialState }),
  });
  // private adapter = createAdapter<LoginUser>()({
  //   changeUsername: (state, username: string | null) => ({ ...state, username: username || '' }),
  //   changePassword: (state, password: string | null) => ({ ...state, password: password || '' }),
  //   changeKeepSession: (state, keepSession: boolean | null) => ({
  //     ...state,
  //     keepSession: keepSession || false,
  //   }),
  //   selectors: {
  //     username: state => state.username,
  //     password: state => state.password,
  //     keepSession: state => state.keepSession,
  //   },
  // });

  // Store --------------------------------------------------------------------
  // public store = adaptNgrx([this.storeName, this.initialState, this.adapter], {
  //   changeUsername: this.usernameChange$,
  //   changePassword: this.passwordChange$,
  //   changeKeepSession: this.keepSessionChange$,
  // });
  public store = adaptNgrx([this.storeName, this.initialState, this.adapter], {
    changeValue: this.valueChanges$,
    pesto: this.pesto$,
  });

  // Helpers ------------------------------------------------------------------

  public constructor(private fb: FormBuilder) {}
  // public constructor(public readonly store: LoginStore) {}
  // public onLoginFormSubmit() {
  //   this.store.login();
  // }
}

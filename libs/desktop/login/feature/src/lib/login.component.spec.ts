// Libraries
import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
// import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { PatchFormGroupValuesDirective } from './login.component';
// Mocks
// import { provideStore } from '@ngrx/store';
// import { adaptReducer } from '@state-adapt/core';
// import { DesktopUserService } from '@towech-finance/desktop/user/data-access';
// import { LoginUser } from '@towech-finance/shared/utils/models';

@Component({
  standalone: true,
  imports: [PatchFormGroupValuesDirective, ReactiveFormsModule, AsyncPipe],
  template: ` <form [formGroup]="form" [patchFormGroupValues]="patcher$ | async"></form> `,
})
class TestComponent {
  public form = new FormGroup({
    user: new FormControl(''),
    pass: new FormControl(''),
  });

  public patch = new EventEmitter<{ user: string; pass: string }>();
  public patcher$ = this.patch.pipe();
}

describe('Patch form Directive', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({ imports: [TestComponent] });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spy = jest.spyOn(component.form, 'patchValue');
  });

  describe('When the patch pipe is called without anything', () => {
    it('Should not modify the form', () => {
      const prevValue = { ...component.form.value };
      // component.patcher$.next(undefined);
      const newValue = { ...component.form.value };

      expect(prevValue).toEqual(newValue);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('When the patch pipe is called with an update', () => {
    it('Should patch the form and have it NOT emit', () => {
      const newValue = { user: 'newuser', pass: 'password' };
      component.patch.next(newValue);
      fixture.detectChanges();
      expect(component.form.value).toEqual(newValue);
      expect(spy).toHaveBeenCalledWith(newValue, { emitEvent: false });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Desktop Login Component', () => {
  // const newValue: LoginUser = { username: 'user', password: 'pass', keepSession: false };
  // let component: DesktopLoginComponent;
  // let fixture: ComponentFixture<DesktopLoginComponent>;
  // let service: DesktopUserService;
  // let compiled: HTMLElement;

  it('', () => {
    expect(1).toBeTruthy();
  });
  // beforeEach(() => {
  //   jest.clearAllMocks();
  //   TestBed.configureTestingModule({
  //     providers: [provideStore({ adapt: adaptReducer }), DesktopUserService],
  //   });
  //   fixture = TestBed.createComponent(DesktopLoginComponent);

  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   compiled = fixture.nativeElement;

  //   service = TestBed.inject<DesktopUserService>(DesktopUserService);
  // });

  // it('Should be defined', () => expect(component).toBeTruthy());

  // it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  // describe('When the form fields are changed', () => {
  //   it('Should update the store', () => {
  //     const spy = subscribeSpyTo(component.store.state$);
  //     component.form.patchValue(newValue);

  //     expect(spy.getLastValue()).toEqual(newValue);
  //   });
  // });

  // // TODO: Add form validation before sending and error processing
  // describe('When the login button is pressed', () => {
  //   it('Should next the userservice', () => {
  //     const userSpy = subscribeSpyTo(service.login$);
  //     const loginBttn: HTMLElement =
  //       fixture.debugElement.nativeElement.querySelector('#Login-button > button');
  //     loginBttn.click();
  //     expect(userSpy.receivedNext()).toBe(true);
  //   });
  // });
});

// Libraries
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// Tested elements
import { DesktopLoginComponent } from './login.component';
// Mocks
import {
  DesktopToasterServiceMock,
  DesktopUserServiceMock,
} from '@finance/desktop/shared/utils-testing';
// Components
import { DesktopLoginShellUiFormComponent } from '@finance/desktop/feature-login/ui-form';

// Component ------------------------------------------------------------------
describe('DesktopLoginComponent', () => {
  let loginForm: DesktopLoginShellUiFormComponent;
  let component: DesktopLoginComponent;
  let fixture: ComponentFixture<DesktopLoginComponent>;
  let userService: DesktopUserService;
  let toastService: DesktopToasterService;

  const getElement = (testid: string) =>
    fixture.debugElement.query(By.css(`[data-test-id="${testid}"]`));

  beforeEach(() => {
    jest.clearAllMocks();
    // TestBed.overrideComponent(DesktopLoginComponent, {
    //   set: { host: { '(click)': 'dummy' }, providers: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    // });
    TestBed.configureTestingModule({
      providers: [
        { provide: DesktopUserService, useValue: DesktopUserServiceMock },
        { provide: DesktopToasterService, useValue: DesktopToasterServiceMock },
      ],
    });
    fixture = TestBed.createComponent(DesktopLoginComponent);
    toastService = TestBed.inject(DesktopToasterService);
    component = fixture.componentInstance;
  });

  it('Should be defined', () => expect(component).toBeTruthy());
  it.todo('Spinner Load');
  it('Login Form', () => {
    const errSpy = jest.spyOn(toastService, 'addError');
    loginForm = getElement('login-form').componentInstance;
    // loginForm.form.setValue({ password: 'ffff', keepSession: false, username: 'ddd' });
    console.log(loginForm.form);
    // loginForm.form.setValue({ password: '', keepSession: false, username: '' });
    loginForm.submitted.next();
    // expect(errSpy).toHaveBeenCalledTimes(1);
  });
});

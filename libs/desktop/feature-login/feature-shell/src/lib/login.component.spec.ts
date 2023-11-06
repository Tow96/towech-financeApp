// Libraries
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
  let component: DesktopLoginComponent;
  let fixture: ComponentFixture<DesktopLoginComponent>;
  let toastService: DesktopToasterService;

  const getElement = (testid: string) =>
    fixture.debugElement.query(By.css(`[data-test-id="${testid}"]`));
  const detectChanges = () => {
    fixture.debugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.overrideComponent(DesktopLoginComponent, {
      set: { host: { '(click)': 'dummy' }, providers: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: DesktopUserService, useValue: DesktopUserServiceMock },
        { provide: DesktopToasterService, useValue: DesktopToasterServiceMock },
      ],
    });
    fixture = TestBed.createComponent(DesktopLoginComponent);
    toastService = TestBed.inject(DesktopToasterService);
    component = fixture.componentInstance;
    detectChanges();
  });

  it('Should be defined', () => expect(component).toBeTruthy());
  it.todo('Spinner Load');
  describe('Login Form', () => {
    let loginForm: DesktopLoginShellUiFormComponent;
    let errSpy: jest.SpyInstance;
    let serviceSpy: jest.SpyInstance;
    beforeEach(() => {
      errSpy = jest.spyOn(toastService, 'addError');
      serviceSpy = jest.spyOn(TestBed.inject(DesktopUserService), 'login');
      loginForm = getElement('login-form').componentInstance;
    });

    it('Should show an error toast if invalid', () => {
      loginForm.form.setValue({ password: '', keepSession: false, username: '' });
      loginForm.submitted.next();
      expect(errSpy).toHaveBeenCalledTimes(1);
      expect(serviceSpy).toHaveBeenCalledTimes(0);
    });
    it('Should pass the login data to the user service when valid', () => {
      loginForm.form.setValue({ password: 'ffff', keepSession: false, username: 'ddd' });
      loginForm.submitted.next();
      expect(errSpy).toHaveBeenCalledTimes(0);
      expect(serviceSpy).toHaveBeenCalledWith({
        password: 'ffff',
        keepSession: false,
        username: 'ddd',
      });
    });
  });
});

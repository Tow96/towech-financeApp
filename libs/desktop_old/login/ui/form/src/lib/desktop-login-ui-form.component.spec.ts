// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Actions } from 'ngrx-forms';
// Tested elements
import { LoginFormComponent } from './desktop-login-ui-form.component';

describe('Login Form', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  describe('When onSubmit is called', () => {
    it('Should trigger a new event', () => {
      const spy = subscribeSpyTo(component.submitted);
      component.onSubmit();

      expect(spy.receivedNext()).toBe(true);
    });
  });

  describe('When updateForm is called', () => {
    it('Should trigger an update event', () => {
      const spy = subscribeSpyTo(component.updated);
      const action: Actions<string> = {
        type: 'ngrx/forms/SET_VALUE',
        controlId: 'loginForm',
        value: 'test',
      };

      component.updateForm(action);

      expect(spy.getLastValue()).toBe(action);
    });
  });
});

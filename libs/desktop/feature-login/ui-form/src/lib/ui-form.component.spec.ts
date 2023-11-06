// Libraries
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopLoginShellUiFormComponent } from './ui-form.component';
// Components
import { DesktopInputComponent } from '@finance/desktop/shared/ui-input';
import { DesktopCheckboxComponent } from '@finance/desktop/shared/ui-checkbox';

describe('DesktopLoginShellUiFormComponent', () => {
  let component: DesktopLoginShellUiFormComponent;
  let fixture: ComponentFixture<DesktopLoginShellUiFormComponent>;

  const detectChanges = () => {
    fixture.debugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
  };
  const getElement = (testid: string) =>
    fixture.debugElement.query(By.css(`[data-test-id="${testid}"]`));

  beforeEach(() => {
    TestBed.overrideComponent(DesktopLoginShellUiFormComponent, {
      set: { host: { '(click)': 'dummy' }, providers: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    fixture = TestBed.createComponent(DesktopLoginShellUiFormComponent);
    component = fixture.componentInstance;

    detectChanges();
  });

  it('Should be defined', () => expect(component).toBeTruthy());
  it('Should update the form when the username input is modified', () => {
    const newValue = 'content';
    const input: DesktopInputComponent = getElement('username').componentInstance;

    input.writeValue(newValue);
    input.onChange({ target: { value: newValue } } as any);
    detectChanges();

    expect(component.form.value.username).toBe(newValue);
  });
  it('Should update the form when the password input is modified', () => {
    const newValue = 'content';
    const input: DesktopInputComponent = getElement('password').componentInstance;

    input.writeValue(newValue);
    input.onChange({ target: { value: newValue } } as any);
    detectChanges();

    expect(component.form.value.password).toBe(newValue);
  });
  it('Should update the form when the keepsession input is modified', () => {
    const newValue = true;
    const input: DesktopCheckboxComponent = getElement('keep-session').componentInstance;

    input.writeValue(newValue);
    input.onChange({ target: { checked: newValue } } as any);
    detectChanges();

    expect(component.form.value.keepSession).toBe(newValue);
  });

  it('Should next the submitted observable when the submit button is clicked', () => {
    const submitted = subscribeSpyTo(component.submitted);
    const bttn: HTMLElement = getElement('submit-bttn').nativeElement.querySelector('button');
    bttn.click();

    expect(submitted.receivedNext()).toBeTruthy();
  });
});

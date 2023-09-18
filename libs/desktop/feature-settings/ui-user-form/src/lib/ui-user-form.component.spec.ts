// Libraries
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopSettingsUiUserFormComponent } from './ui-user-form.component';
// Components
import { DesktopInputComponent } from '@finance/desktop/shared/ui-input';

describe('DesktopSettingsUiUserForm', () => {
  let component: DesktopSettingsUiUserFormComponent;
  let fixture: ComponentFixture<DesktopSettingsUiUserFormComponent>;
  let compiled: HTMLElement;

  const getElement = (testid: string) =>
    fixture.debugElement.query(By.css(`[data-test-id="${testid}"]`));
  const detectChanges = () => {
    fixture.debugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
  };
  const setInputValue = (name: string, value: string) => {
    const input: DesktopInputComponent = getElement(name).componentInstance;
    input.writeValue(value);
    input.onChange({ target: { value } } as any);
    detectChanges();
  };

  beforeEach(() => {
    TestBed.overrideComponent(DesktopSettingsUiUserFormComponent, {
      set: { host: { '(click)': 'dummy' }, providers: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    fixture = TestBed.createComponent(DesktopSettingsUiUserFormComponent);
    component = fixture.componentInstance;

    detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());
  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());
  it('Should update the name when the input changes', () => {
    const newValue = 'Name';
    setInputValue('name', newValue);
    expect(component.form.value.name).toBe(newValue);
  });
  it('Should update the email when the input changes', () => {
    const newValue = 'mail@provider.com';
    setInputValue('mail', newValue);
    expect(component.form.value.mail).toBe(newValue);
  });
  it('Should emit when submiited', () => {
    const spy = subscribeSpyTo(component.submitted);
    const btn: HTMLElement = getElement('submit-edit-user').nativeElement.querySelector('button');
    btn.click();
    expect(spy.receivedNext()).toBeTruthy();
  });
});

// Libraries
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// Tested elements
import { DesktopLoginShellUiFormComponent } from './ui-form.component';

describe('DesktopLoginShellUiFormComponent', () => {
  let component: DesktopLoginShellUiFormComponent;
  let fixture: ComponentFixture<DesktopLoginShellUiFormComponent>;

  // function detectOnPushChanges() {
  //   fixture.debugElement.triggerEventHandler('click', null);
  //   fixture.detectChanges();
  // }
  // function getElement(testid: string) {
  //   return fixture.debugElement.query(By.css(`[data-test-id="${testid}"]`));
  // }

  beforeEach(() => {
    TestBed.overrideComponent(DesktopLoginShellUiFormComponent, {
      set: {
        host: { '(click)': 'dummy' },
        providers: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    });
    fixture = TestBed.createComponent(DesktopLoginShellUiFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  // TODO: Make test for field update
  // it('Should update the form when the username input is modified', () => {
  //   const newValue = 'content';
  //   const input = getElement('username');
  //   console.log(input.childNodes);
  //   // input.nativeElement.value = newValue;
  //   // input.nativeElement.dispatchEvent(new Event('input'));
  //   // detectOnPushChanges();

  //   // expect(component.form.value.username).toBe(newValue);
  // });
});

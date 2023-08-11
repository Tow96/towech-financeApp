// LIbraries
import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// Tested elements
import { PatchFormGroupValuesDirective } from './form.directive';

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

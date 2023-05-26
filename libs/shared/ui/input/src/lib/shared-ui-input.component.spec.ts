// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { SharedInputComponent } from './shared-ui-input.component';
import { NGRX_FORM_VIEW_ADAPTER } from 'ngrx-forms';

describe('Shared Input Component', () => {
  let component: SharedInputComponent;
  let fixture: ComponentFixture<SharedInputComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInputComponent);
    component = fixture.componentInstance;
    component.type = 'text';
    component.label = 'TEST';

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Should implement the NGRX_FORM_VIEW_ADAPTER', () => {
    expect(fixture.debugElement.injector.get(NGRX_FORM_VIEW_ADAPTER)).toBeTruthy();
  });

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  it('The changed and touched functions must do nothing at start', () => {
    expect(component.changed('t')).toBeUndefined();
    expect(component.touched()).toBeUndefined();
  });

  describe('When setViewValue is called', () => {
    it('Should update the value', () => {
      const newValue = 'This is a test value';

      component.setViewValue(newValue);
      expect(component.value).toBe(newValue);
    });
  });

  describe('When setOnChangeCallback is called', () => {
    it('Should update the changed function', () => {
      const newChanged = (value: string) => {
        console.log(value);
      };

      component.setOnChangeCallback(newChanged);
      expect(component.changed).toBe(newChanged);
    });
  });

  describe('When setOnTouchedCallback is called', () => {
    it('Should update the touched function', () => {
      const newTouched = () => {
        console.log('NEW FUNCTION');
      };

      component.setOnTouchedCallback(newTouched);
      expect(component.touched).toBe(newTouched);
    });
  });

  describe('When setIsDisabled is called', () => {
    it('Should set the disabled value', () => {
      component.setIsDisabled(true);
      expect(component.disabled).toBe(true);
      component.setIsDisabled(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('When on change is called', () => {
    it('Should call the changed function with the new value', () => {
      const newValue = 'updatedValue';
      const event = { target: { value: newValue } } as any;

      const spy = jest.spyOn(component, 'changed');

      component.onChange(event);

      expect(spy).toHaveBeenCalledWith(newValue);
    });
  });
});

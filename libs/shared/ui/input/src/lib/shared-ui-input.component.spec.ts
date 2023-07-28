// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { SharedInputComponent } from './shared-ui-input.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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

  it('Should implement the NG_VALUE_ACCESSOR', () => {
    expect(fixture.debugElement.injector.get(NG_VALUE_ACCESSOR)).toBeTruthy();
  });

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  it('The customChanged and customTouched functions must do nothing at start', () => {
    expect(component.customChanged('t')).toBeUndefined();
    expect(component.customTouched()).toBeUndefined();
  });

  describe('When setViewValue is called', () => {
    it('Should update the value', () => {
      const newValue = 'This is a test value';

      component.writeValue(newValue);
      expect(component.value).toBe(newValue);
    });
  });

  describe('When setOnChangeCallback is called', () => {
    it('Should update the customChanged function', () => {
      const newChanged = (value: string) => {
        console.log(value);
      };

      component.registerOnChange(newChanged);
      expect(component.customChanged).toBe(newChanged);
    });
  });

  describe('When setOnTouchedCallback is called', () => {
    it('Should update the touched function', () => {
      const newTouched = () => {
        console.log('NEW FUNCTION');
      };

      component.registerOnTouched(newTouched);
      expect(component.customTouched).toBe(newTouched);
    });
  });

  describe('When setIsDisabled is called', () => {
    it('Should set the disabled value', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('When on change is called', () => {
    it('Should call the customChanged function with the new value', () => {
      const newValue = 'updatedValue';
      const event = { target: { value: newValue } } as any;

      const spy = jest.spyOn(component, 'customChanged');

      component.onChange(event);

      expect(spy).toHaveBeenCalledWith(newValue);
    });
  });
});

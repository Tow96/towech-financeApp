// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { SharedCheckboxComponent } from './shared-ui-checkbox.component';
import { NGRX_FORM_VIEW_ADAPTER } from 'ngrx-forms';

describe('Shared Input Component', () => {
  let component: SharedCheckboxComponent;
  let fixture: ComponentFixture<SharedCheckboxComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCheckboxComponent);
    component = fixture.componentInstance;
    // component.type = 'text';
    component.label = 'TEST';

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  it('Should implement the NGRX_FORM_VIEW_ADAPTER', () => {
    expect(fixture.debugElement.injector.get(NGRX_FORM_VIEW_ADAPTER)).toBeTruthy();
  });

  it('The changed and touched functions must do nothing at start', () => {
    expect(component.changed(false)).toBeUndefined();
    expect(component.touched()).toBeUndefined();
  });

  describe('When setViewValue is called', () => {
    it('Should update the value', () => {
      component.setViewValue(true);
      expect(component.value).toBe(true);

      component.setViewValue(false);
      expect(component.value).toBe(false);
    });
  });

  describe('When setOnChangeCallback is called', () => {
    it('Should update the changed function', () => {
      const newChanged = (value: boolean) => {
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
      const event = { target: { checked: true } } as any;

      const spy = jest.spyOn(component, 'changed');
      component.onChange(event);
      expect(spy).toHaveBeenCalledWith(true);

      jest.clearAllMocks();
      event.target.checked = false;
      component.onChange(event);
      expect(spy).toHaveBeenCalledWith(false);
    });
  });
});

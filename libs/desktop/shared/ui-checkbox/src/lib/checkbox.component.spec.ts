// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopCheckboxComponent } from './checkbox.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('Shared Input Component', () => {
  let component: DesktopCheckboxComponent;
  let fixture: ComponentFixture<DesktopCheckboxComponent>;
  let compiled: HTMLElement;
  let spy: jest.SpyInstance<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    fixture = TestBed.createComponent(DesktopCheckboxComponent);
    component = fixture.componentInstance;
    // component.type = 'text';
    component.label = 'TEST';

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  it('Should implement the NG_VALUE_ACCESSOR', () =>
    expect(fixture.debugElement.injector.get(NG_VALUE_ACCESSOR)).toBeTruthy());

  it('The changed and customTouched functions must do nothing when declared', () => {
    expect(component.customChanged(false)).toBeUndefined();
    expect(component.customTouched()).toBeUndefined();
  });

  describe('When writeValue is called', () => {
    it('Should update the value', () => {
      component.writeValue(true);
      expect(component.value).toBe(true);

      component.writeValue(false);
      expect(component.value).toBe(false);
    });
  });

  describe('When setOnChangeCallback is called', () => {
    it('Should update the changed function', () => {
      const newChanged = (value: boolean) => {
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
    let event: any;

    beforeEach(() => {
      event = { target: { checked: true } } as any;
      spy = jest.spyOn(component, 'customChanged');
      component.onChange(event);
    });
    it('Should call the customChanged function', () =>
      expect(spy).toHaveBeenCalledWith(event.target.checked));
  });

  describe('When the checkbox is clicked', () => {
    beforeEach(() => {
      spy = jest.spyOn(component, 'onChange');
      component.value = false;
      const checkbox = fixture.debugElement.nativeElement.querySelector('input');
      checkbox.click();
    });

    it('Should call the onChange function', () => expect(spy).toHaveBeenCalled());
  });

  describe('When the label is clicked', () => {
    beforeEach(() => {
      spy = jest.spyOn(component, 'onChange');
      component.value = false;
      const label = fixture.debugElement.nativeElement.querySelector('label');
      label.click();
    });

    it('Should call the onChange function', () => expect(spy).toHaveBeenCalled());
  });
});

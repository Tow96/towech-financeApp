// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested Elements
import { DesktopToastUIComponent } from './desktop-toaster-ui.component';
import {
  DesktopToast,
  DesktopToasterService,
  ToastTypes,
} from '@towech-finance/desktop/toasts/data-access';

const stubToast = (): DesktopToast => ({
  id: 'test-id',
  message: 'Toast content',
  type: ToastTypes.ACCENT,
});

describe('Toast Component', () => {
  let compiled: HTMLElement;
  let component: DesktopToastUIComponent;
  let fixture: ComponentFixture<DesktopToastUIComponent>;
  let service: DesktopToasterService;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopToastUIComponent);
    service = TestBed.inject(DesktopToasterService);
    component = fixture.componentInstance;

    component.toast = stubToast();
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Must match the snapshot', () => {
    expect(compiled).toMatchSnapshot();
  });

  describe('When ngAfterContentInit is called and the component has a toast', () => {
    it('Should remove it by calling the toast service after some time has passed', async () => {
      const spy = jest.spyOn(service, 'dismiss');
      jest.useFakeTimers();
      component.ngAfterContentInit();
      jest.runAllTimers();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(stubToast().id);
      jest.useRealTimers();
    });
  });

  describe('When ngAfterContentInit is called and the component does not have a toast', () => {
    it('Should do nothing', async () => {
      component.toast = undefined;

      const spy = jest.spyOn(service, 'dismiss');
      jest.useFakeTimers();
      component.ngAfterContentInit();
      jest.runAllTimers();

      expect(spy).toHaveBeenCalledTimes(0);
      jest.useRealTimers();
    });
  });

  describe('When hide is called and the component does not have a toast', () => {
    it('Should do nothing', async () => {
      component.toast = undefined;

      const spy = jest.spyOn(service, 'dismiss');
      component.hide();

      expect(spy).toHaveBeenCalledTimes(0);
      jest.useRealTimers();
    });
  });
});

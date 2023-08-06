// Libraries 98
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested Elements
import { DesktopToastComponent } from './toast.component';
// Stubs
import { stubAccentToast } from '@finance/desktop/shared/utils-testing';

describe('Toast Component', () => {
  let compiled: HTMLElement;
  let component: DesktopToastComponent;
  let fixture: ComponentFixture<DesktopToastComponent>;
  let spy: SubscriberSpy<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BrowserAnimationsModule] });
    fixture = TestBed.createComponent(DesktopToastComponent);
    component = fixture.componentInstance;

    component.toast = stubAccentToast();
    fixture.detectChanges();
    compiled = fixture.nativeElement;

    spy = subscribeSpyTo(component.dismiss);
  });

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  describe('When ngAfterContentInit is called', () => {
    function runFunction() {
      jest.useFakeTimers();
      component.ngAfterContentInit();
      jest.runAllTimers();
    }

    afterEach(() => jest.useRealTimers());

    describe('And the component has a toast', () => {
      it('Should remove it by calling the toast service after some time has passed', async () => {
        runFunction();
        expect(spy.getLastValue()).toBe(stubAccentToast().id);
      });
    });
    describe('When ngAfterContentInit is called and the component does not have a toast', () => {
      it('Should do nothing', async () => {
        component.toast = undefined;
        runFunction();
        expect(spy.receivedNext()).toBe(false);
      });
    });
  });

  describe('When hide is called and the component does not have a toast', () => {
    it('Should do nothing', async () => {
      component.toast = undefined;
      component.hide();

      expect(spy.receivedNext()).toBe(false);
    });
  });

  describe('When getClass is called', () => {
    it('Should return an array indicating which classes should be activated', () => {
      const result = component.getTypeClass();

      expect(result).toEqual({
        color: true,
        error: false,
        success: false,
        warning: false,
      });
    });

    it('Should return default values if there is no toast', () => {
      component.toast = undefined;
      const result = component.getTypeClass();

      expect(result).toEqual({
        color: true,
        error: false,
        success: false,
        warning: false,
      });
    });
  });
});

// Libraries
import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopToasterService, ToastTypes } from './desktop-toaster.service';

let service: DesktopToasterService;

describe('Toaster-Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesktopToasterService);
  });

  describe('When addAccent is called', () => {
    it('Should add the toast to the tray', () => {
      const spy = subscribeSpyTo(service.toastTray);
      service.addAccent('ADD TEST', 200);

      expect(spy.getLastValue()).toEqual([
        { id: expect.any(String), message: 'ADD TEST', duration: 200, type: ToastTypes.ACCENT },
      ]);
    });
  });

  describe('When addError is called', () => {
    it('Should add the toast to the tray', () => {
      const spy = subscribeSpyTo(service.toastTray);
      service.addError('ADD TEST', 200);

      expect(spy.getLastValue()).toEqual([
        { id: expect.any(String), message: 'ADD TEST', duration: 200, type: ToastTypes.ERROR },
      ]);
    });
  });

  describe('When addSuccess is called', () => {
    it('Should add the toast to the tray', () => {
      const spy = subscribeSpyTo(service.toastTray);
      service.addSuccess('ADD TEST', 200);

      expect(spy.getLastValue()).toEqual([
        { id: expect.any(String), message: 'ADD TEST', duration: 200, type: ToastTypes.SUCCESS },
      ]);
    });
  });

  describe('When addWarning is called', () => {
    it('Should add the toast to the tray', () => {
      const spy = subscribeSpyTo(service.toastTray);
      service.addWarning('ADD TEST', 200);

      expect(spy.getLastValue()).toEqual([
        { id: expect.any(String), message: 'ADD TEST', duration: 200, type: ToastTypes.WARNING },
      ]);
    });
  });

  describe('When dismiss is called', () => {
    it('Should remove only the dismissed value', () => {
      const spy = subscribeSpyTo(service.toastTray);
      service.addAccent('ADD TEST0', 200);
      service.addAccent('ADD TEST1', 200);
      service.addAccent('ADD TEST2', 200);
      service.addAccent('ADD TEST3', 200);
      const input = spy.getLastValue() || [];
      const inputLength = input.length;

      service.dismiss(input[2].id);

      const result = spy.getLastValue();
      expect(result?.length).toBe(inputLength - 1);
      expect(result).toEqual(input.filter(x => x.id !== input[2].id));
    });
  });
});

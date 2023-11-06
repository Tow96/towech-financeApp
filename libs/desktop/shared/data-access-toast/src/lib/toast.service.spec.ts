// Libraries
import { TestBed } from '@angular/core/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopToasterService } from './toast.service';
// Mocks
import { provideStore } from '@ngrx/store';
// Models
import { DesktopToast, ToastTypes } from './types';

let service: DesktopToasterService;

describe('Toaster-Service', () => {
  let message: string;
  let spy: SubscriberSpy<DesktopToast[]>;

  function checkToast(result: DesktopToast[] | undefined, type: ToastTypes) {
    expect((result || [])[0]).toEqual({
      id: expect.any(String),
      message,
      type,
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideStore()] });
    service = TestBed.inject(DesktopToasterService);
    spy = subscribeSpyTo(service.tray$);
  });

  it('Should exist', () => expect(service).toBeTruthy());

  describe('When addAccent is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is an accent';
      service.addAccent(message);

      checkToast(spy.getLastValue(), ToastTypes.ACCENT);
    });
  });

  describe('When addError is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is an error';
      service.addError(message);

      checkToast(spy.getLastValue(), ToastTypes.ERROR);
    });
  });

  describe('When addSucess is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is a success';
      service.addSuccess(message);

      checkToast(spy.getLastValue(), ToastTypes.SUCCESS);
    });
  });

  describe('When addWarning is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is a warning';
      service.addWarning(message);

      checkToast(spy.getLastValue(), ToastTypes.WARNING);
    });
  });

  describe('When dismiss is called', () => {
    it('Should remove only the dismissed value', () => {
      service.addAccent('ADD TEST1');
      service.addAccent('ADD TEST2');
      service.addAccent('ADD TEST3');
      service.addAccent('ADD TEST4');

      const prior = spy.getLastValue() || [];
      service.dismiss(prior[2].id);

      const result = spy.getLastValue();
      expect(result?.length).toBe(prior.length - 1);
      expect(result).toEqual(prior.filter(x => x.id !== prior[2].id));
    });
  });
});

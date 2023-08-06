// Libraries
import { TestBed } from '@angular/core/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopSharedDataAccessToasterService } from './desktop-toaster.service';
// Mocks
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';
// Models
import { DesktopToast, ToastTypes } from '@finance/desktop/shared/utils-types';

let service: DesktopSharedDataAccessToasterService;
const TOASTDURATION = 2000;

describe('Toaster-Service', () => {
  let message: string;
  let spy: SubscriberSpy<DesktopToast[]>;

  function checkToast(result: DesktopToast[] | undefined, type: ToastTypes) {
    expect((result || [])[0]).toEqual({
      id: expect.any(String),
      message,
      duration: TOASTDURATION,
      type,
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideStore({ adapt: adaptReducer })] });
    service = TestBed.inject(DesktopSharedDataAccessToasterService);
    spy = subscribeSpyTo(service.toasts.state$);
  });

  it('Should exist', () => expect(service).toBeTruthy());

  describe('When addAccent$ is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is an accent';
      service.addAccent$.next({ message, duration: TOASTDURATION });

      checkToast(spy.getLastValue(), ToastTypes.ACCENT);
    });
  });

  describe('When addError$ is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is an error';
      service.addError$.next({ message, duration: TOASTDURATION });

      checkToast(spy.getLastValue(), ToastTypes.ERROR);
    });
  });

  describe('When addSucess$ is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is a success';
      service.addSuccess$.next({ message, duration: TOASTDURATION });

      checkToast(spy.getLastValue(), ToastTypes.SUCCESS);
    });
  });

  describe('When addWarning$ is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is a warning';
      service.addWarning$.next({ message, duration: TOASTDURATION });

      checkToast(spy.getLastValue(), ToastTypes.WARNING);
    });
  });

  describe('When dismiss is called', () => {
    it('Should remove only the dismissed value', () => {
      service.addAccent$.next({ message: 'ADD TEST1', duration: 200 });
      service.addAccent$.next({ message: 'ADD TEST2', duration: 200 });
      service.addAccent$.next({ message: 'ADD TEST3', duration: 200 });
      service.addAccent$.next({ message: 'ADD TEST4', duration: 200 });

      const prior = spy.getLastValue() || [];
      service.dismiss$.next(prior[2].id);

      const result = spy.getLastValue();
      expect(result?.length).toBe(prior.length - 1);
      expect(result).toEqual(prior.filter(x => x.id !== prior[2].id));
    });
  });
});

// Libraries
import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopToasterService, ToastTypes } from './desktop-toaster.service';
// Mocks
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';

let service: DesktopToasterService;
const TOASTDURATION = 2000;

describe('Toaster-Service', () => {
  let message: string;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideStore({ adapt: adaptReducer })] });
    service = TestBed.inject(DesktopToasterService);
  });

  it('Should exist', () => expect(service).toBeTruthy());

  describe('When addAccent$ is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is an accent';

      const spy = subscribeSpyTo(service.toasts.state$);
      service.addAccent$.next({ message, duration: TOASTDURATION });

      const lastTray = spy.getLastValue() || [];

      expect(lastTray[0]).toEqual({
        id: expect.any(String),
        message,
        duration: TOASTDURATION,
        type: ToastTypes.ACCENT,
      });
    });
  });

  describe('When addError$ is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is an error';

      const spy = subscribeSpyTo(service.toasts.state$);
      service.addError$.next({ message, duration: TOASTDURATION });

      const lastTray = spy.getLastValue() || [];

      expect(lastTray[0]).toEqual({
        id: expect.any(String),
        message,
        duration: TOASTDURATION,
        type: ToastTypes.ERROR,
      });
    });
  });

  describe('When addSucess$ is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is a success';

      const spy = subscribeSpyTo(service.toasts.state$);
      service.addSuccess$.next({ message, duration: TOASTDURATION });

      const lastTray = spy.getLastValue() || [];

      expect(lastTray[0]).toEqual({
        id: expect.any(String),
        message,
        duration: TOASTDURATION,
        type: ToastTypes.SUCCESS,
      });
    });
  });

  describe('When addWarning$ is called', () => {
    it('Should add the toast to the tray', () => {
      message = 'This is a warning';

      const spy = subscribeSpyTo(service.toasts.state$);
      service.addWarning$.next({ message, duration: TOASTDURATION });

      const lastTray = spy.getLastValue() || [];

      expect(lastTray[0]).toEqual({
        id: expect.any(String),
        message,
        duration: TOASTDURATION,
        type: ToastTypes.WARNING,
      });
    });
  });

  describe('When dismiss is called', () => {
    it('Should remove only the dismissed value', () => {
      const spy = subscribeSpyTo(service.toasts.state$);
      service.addAccent$.next({ message: 'ADD TEST1', duration: 200 });
      service.addAccent$.next({ message: 'ADD TEST2', duration: 200 });
      service.addAccent$.next({ message: 'ADD TEST3', duration: 200 });
      service.addAccent$.next({ message: 'ADD TEST4', duration: 200 });
      const input = spy.getLastValue() || [];
      const inputLength = input.length;

      service.dismiss$.next(input[2].id);

      const result = spy.getLastValue();
      expect(result?.length).toBe(inputLength - 1);
      expect(result).toEqual(input.filter(x => x.id !== input[2].id));
    });
  });
});

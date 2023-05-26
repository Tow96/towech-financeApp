// Libraries
import { Component } from '@angular/core';
// Tested elements
import { DesktopGlobalErrorToastClass, messages } from './error-handler';
// Services
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';

// Mock component
@Component({
  selector: 'towech-finance-mock',
  template: '',
})
export class MockComponent {
  public test() {
    throw new Error('test Error');
  }
}

describe('Toast error handler', () => {
  let handler: any;
  let toasts: DesktopToasterService;
  let spy: jest.SpyInstance<any>;
  beforeEach(() => {
    jest.clearAllMocks();
    toasts = new DesktopToasterService();
    handler = new DesktopGlobalErrorToastClass({ get: () => toasts });
    spy = jest.spyOn(toasts, 'addError');
  });

  it('Should exist', () => expect(handler).toBeTruthy());

  describe('When the handler is called without anything', () => {
    it('Should call the toast service with an unkwnon error', () => {
      handler.handleError();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(messages.UNKNOWN);
    });
  });

  describe('When the handler is called with an  empty object', () => {
    it('Should call the toast service wiht the default message', () => {
      handler.handleError({});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(messages.DEFAULT);
    });
  });

  describe('When the handler is called with a sync message', () => {
    it('Should call the toast service with the message', () => {
      handler.handleError({ message: 'TEST' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('TEST');
    });
  });

  describe('When the handler is called with an async message', () => {
    it('Should call the toast service with the message', () => {
      handler.handleError({ rejection: { message: 'TEST' } });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('TEST');
    });
  });
});

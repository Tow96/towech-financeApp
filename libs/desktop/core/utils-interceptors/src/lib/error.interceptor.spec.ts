// Tested elements
import { DesktopErrorInterceptorClass, messages } from './error.interceptor';

const mockService = {
  addError: jest.fn,
};

describe('Toast error handler', () => {
  let handler: any;
  let spy: jest.SpyInstance;

  function validateToast(message: string) {
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(message);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new DesktopErrorInterceptorClass({ get: () => mockService });
    spy = jest.spyOn(mockService, 'addError');
  });

  it('Should exist', () => expect(handler).toBeTruthy());

  describe('When the handler is called without anything', () => {
    it('Should call the toast service with an unkwnon error', () => {
      handler.handleError();
      validateToast(messages.UNKNOWN);
    });
  });

  describe('When the handler is called with an  empty object', () => {
    it('Should call the toast service wiht the default message', () => {
      handler.handleError({});
      validateToast(messages.DEFAULT);
    });
  });

  describe('When the handler is called with a sync message', () => {
    it('Should call the toast service with the message', () => {
      handler.handleError({ message: 'TEST' });
      validateToast('TEST');
    });
  });

  describe('When the handler is called with an async message', () => {
    it('Should call the toast service with the message', () => {
      handler.handleError({ rejection: { message: 'TEST' } });
      validateToast('TEST');
    });
  });
});

// Libraries
import { subscribeSpyTo, SubscriberSpy } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopGlobalErrorToastClass, messages } from './error-handler';
// Services
import { NewToast } from '@towech-finance/desktop/toasts/utils';
import { Source } from '@state-adapt/rxjs';

const ACTIONTYPE = '[Toast Service] Add Error Toast';
const mockService = {
  addError$: new Source<NewToast>(ACTIONTYPE),
};

describe('Toast error handler', () => {
  let handler: any;
  let spy: SubscriberSpy<any>;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new DesktopGlobalErrorToastClass({ get: () => mockService });
    spy = subscribeSpyTo(mockService.addError$);
  });

  it('Should exist', () => expect(handler).toBeTruthy());

  describe('When the handler is called without anything', () => {
    it('Should call the toast service with an unkwnon error', () => {
      handler.handleError();
      expect(spy.receivedNext()).toBe(true);
      expect(spy.getLastValue()).toEqual({
        type: ACTIONTYPE,
        payload: { message: messages.UNKNOWN },
      });
    });
  });

  describe('When the handler is called with an  empty object', () => {
    it('Should call the toast service wiht the default message', () => {
      handler.handleError({});
      expect(spy.receivedNext()).toBe(true);
      expect(spy.getLastValue()).toEqual({
        type: ACTIONTYPE,
        payload: { message: messages.DEFAULT },
      });
    });
  });

  describe('When the handler is called with a sync message', () => {
    it('Should call the toast service with the message', () => {
      handler.handleError({ message: 'TEST' });
      expect(spy.receivedNext()).toBe(true);
      expect(spy.getLastValue()).toEqual({
        type: ACTIONTYPE,
        payload: { message: 'TEST' },
      });
    });
  });

  describe('When the handler is called with an async message', () => {
    it('Should call the toast service with the message', () => {
      handler.handleError({ rejection: { message: 'TEST' } });
      expect(spy.receivedNext()).toBe(true);
      expect(spy.getLastValue()).toEqual({
        type: ACTIONTYPE,
        payload: { message: 'TEST' },
      });
    });
  });
});

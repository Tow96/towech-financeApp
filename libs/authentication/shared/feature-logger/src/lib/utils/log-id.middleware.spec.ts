// Libraries
import { LogIdMiddleware } from './log-id.middleware';
import { LogIdRequest } from './log-id.model';

// Stubs
const stubResponse = (): any => {
  return {
    set: jest.fn(),
  };
};

const stubNextFn = (): any => {
  return jest.fn();
};

describe('LogIdMiddleware', () => {
  let logid: LogIdMiddleware;

  beforeEach(() => {
    jest.clearAllMocks();
    logid = new LogIdMiddleware();
  });

  describe('When the middleware is used', () => {
    const req = {} as LogIdRequest;
    const res = stubResponse();
    const next = stubNextFn();

    beforeEach(() => {
      jest.spyOn(res, 'set');
      logid.use(req, res, next);
    });

    test('Then the request should have a log id value added', () => {
      expect(req.logId).toBeDefined();
    });

    test(`Then the response should have a logId header defined`, () =>
      expect(res.set).toBeCalledWith('logId', expect.any(String)));

    test('Then the next function should be called only once', () =>
      expect(next).toBeCalledTimes(1));
  });
});

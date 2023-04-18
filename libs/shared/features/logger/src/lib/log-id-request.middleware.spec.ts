/* eslint-disable */
// Libraries
import { LogIdMiddleware } from './log-id.middleware';
import { LogIdRequest } from './log-id.middleware';

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

  beforeAll(() => {
    logid = new LogIdMiddleware();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('When the middleware is used', () => {
    const req = {} as LogIdRequest;
    const res = stubResponse();
    const next = stubNextFn();

    beforeAll(() => {
      logid.use(req, res, next);
    });

    test('Then the request should have a log id value added', () => {
      jest.spyOn(res, 'set');

      expect(req.logId).toBeDefined();
    });

    test(`Then the response should have a logId header defined`, () => {
      expect(res.set).toBeCalledWith('logId', expect.any(String));
    });

    test('Then the next function should be called only once', () => {
      expect(next).toBeCalledTimes(1);
    });
  });
});

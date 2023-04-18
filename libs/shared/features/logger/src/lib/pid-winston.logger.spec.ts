/* eslint-disable */
import { describe } from 'node:test';
import { PidWinstonLogger } from './pid-winston.logger';

describe('PidLogger', () => {
  let pidLogger: PidWinstonLogger;
  const OLD_ENV = process.env;

  beforeAll(() => {
    pidLogger = new PidWinstonLogger();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
  });

  describe('Logger Transports', () => {
    describe('When the pid logger is used with DISABLE_LOGGING anything but true', () => {
      test('Then there should be three transports', () => {
        process.env.DISABLE_LOGGING = 'false';
        expect(PidWinstonLogger.transports().length).toBe(3);
      });
    });
    describe('When the pid logger is used with DISABLE_LOGGING as "true"', () => {
      test('Then there should only be one transport', () => {
        process.env.DISABLE_LOGGING = 'true';
        expect(PidWinstonLogger.transports().length).toBe(1);
      });
    });
  });

  // TODO:
  describe('Logging', () => {
    const message = 'TEST MSG';
  });
});

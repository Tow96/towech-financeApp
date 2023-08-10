// Libraries
import { jest } from '@jest/globals';

export const AuthenticationPidWinstonLoggerMock = {
  pidError: jest.fn(),
  pidWarn: jest.fn(),
  pidLog: jest.fn(),
  pidVerbose: jest.fn(),
  pidDebug: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
};

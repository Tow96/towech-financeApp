// Libraries
import { Provider } from '@nestjs/common';
import { jest } from '@jest/globals';
// Services
import { AuthenticationPidWinstonLogger } from '@finance/authentication/shared/feature-logger';

const mockValues = {
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

export const AuthenticationPidWinstonLoggerMock: Provider = {
  provide: AuthenticationPidWinstonLogger,
  useValue: mockValues,
};

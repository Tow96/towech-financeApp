import { describe } from 'node:test';
import { PidWinstonLogger } from './pid-winston.logger';

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

describe('Logger Message', () => {
  let info;

  beforeEach(() => {
    info = {
      timestamp: 'today',
      level: 'log',
      message: 'This is a test',
    };
  });

  describe('When getFormatted Output is called with a pid', () => {
    it('Should return a message containing a pid', () => {
      info.pid = '000';
      expect(PidWinstonLogger.getFormattedOutput(info)).toBe(
        `${info.timestamp} {pid: ${info.pid}} [UNNAMED APP] ${info.level}: ${info.message}`
      );
    });
  });

  describe('When getFormatted Output is called without a pid', () => {
    it('Should return a message', () => {
      expect(PidWinstonLogger.getFormattedOutput(info)).toBe(
        `${info.timestamp} [UNNAMED APP] ${info.level}: ${info.message}`
      );
    });
  });
});

describe('Logger Format', () => {
  describe('When the logger format is called', () => {
    it('Should return something', () => {
      const msg = PidWinstonLogger.format().transform({ level: 'debug', message: 'test message' });
      expect(msg).toEqual(
        expect.objectContaining({
          level: 'debug',
          message: 'test message',
          timestamp: expect.any(String),
        })
      );
    });
  });
});

describe('Logger Transports', () => {
  describe('When the pid logger is used with DISABLE_LOGGING anything but true', () => {
    test('Then there should be three transports', () => {
      process.env.DISABLE_LOGGING = undefined;
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

describe('When pidError is called', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(pidLogger, 'error');
  });

  it('it should call Error with a pid', () => {
    pidLogger.pidError('01', 'error');
    expect(pidLogger.error).toBeCalledTimes(1);
    expect(pidLogger.error).toBeCalledWith({ pid: '01', message: 'error' }, undefined, undefined);
  });
});

describe('When pidWarn is called', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(pidLogger, 'warn');
  });

  it('it should call Warn with a pid', () => {
    pidLogger.pidWarn('02', 'warn');
    expect(pidLogger.warn).toBeCalledTimes(1);
    expect(pidLogger.warn).toBeCalledWith({ pid: '02', message: 'warn' });
  });
});

describe('When pidLog is called', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(pidLogger, 'log');
  });

  it('it should call Log with a pid', () => {
    pidLogger.pidLog('03', 'log');
    expect(pidLogger.log).toBeCalledTimes(1);
    expect(pidLogger.log).toBeCalledWith({ pid: '03', message: 'log' });
  });
});

describe('When pidVerbose is called', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(pidLogger, 'verbose');
  });

  it('it should call Verbose with a pid', () => {
    pidLogger.pidVerbose('04', 'verbose');
    expect(pidLogger.verbose).toBeCalledTimes(1);
    expect(pidLogger.verbose).toBeCalledWith({ pid: '04', message: 'verbose' });
  });
});

describe('When pidDebug is called', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(pidLogger, 'debug');
  });

  it('it should call debug with a pid', () => {
    pidLogger.pidDebug('05', 'debug');
    expect(pidLogger.debug).toBeCalledTimes(1);
    expect(pidLogger.debug).toBeCalledWith({ pid: '05', message: 'debug' });
  });
});

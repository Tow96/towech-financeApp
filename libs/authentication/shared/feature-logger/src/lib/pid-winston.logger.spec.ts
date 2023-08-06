import { describe } from 'node:test';
import { PidWinstonLogger } from './pid-winston.logger';

let pidLogger: PidWinstonLogger;
const OLD_ENV = process.env;

describe('Pid winstom logger', () => {
  beforeEach(() => jest.clearAllMocks());
  // pidLogger = new PidWinstonLogger();

  describe('Static methods', () => {
    describe('When getFormattedOutput is called', () => {
      const info: any = {
        timestamp: 'today',
        level: 'log',
        message: 'This is a test',
      };

      it('Should return a message containing a pid when called with an object containing a pid', () => {
        info.pid = '000';
        expect(PidWinstonLogger.getFormattedOutput(info)).toBe(
          `${info.timestamp} {pid: ${info.pid}} [UNNAMED APP] ${info.level}: ${info.message}`
        );
      });

      it('Should return a message without pid when called with an object without pid', () => {
        info.pid = undefined;
        expect(PidWinstonLogger.getFormattedOutput(info)).toBe(
          `${info.timestamp} [UNNAMED APP] ${info.level}: ${info.message}`
        );
      });
    });

    describe('When format is called', () => {
      it('Should return something', () => {
        const msg = PidWinstonLogger.format().transform({
          level: 'debug',
          message: 'test message',
        });
        expect(msg).toEqual(
          expect.objectContaining({
            level: 'debug',
            message: 'test message',
            timestamp: expect.any(String),
          })
        );
      });
    });

    describe('When transports is called', () => {
      afterEach(() => (process.env = OLD_ENV));

      test('With DISABLE_LOGGING as not true, it should return three transports', () => {
        process.env['DISABLE_LOGGING'] = undefined;
        expect(PidWinstonLogger.transports().length).toBe(3);
      });

      test('With DISABLE_LOGGING as true, it should return one transport', () => {
        process.env['DISABLE_LOGGING'] = 'true';
        expect(PidWinstonLogger.transports().length).toBe(1);
      });
    });
  });

  describe('Regular methods', () => {
    beforeEach(() => (pidLogger = new PidWinstonLogger()));

    test('When pidError is called, it should call Error with a pid', () => {
      jest.spyOn(pidLogger, 'error');
      pidLogger.pidError('01', 'error');
      expect(pidLogger.error).toBeCalledWith({ pid: '01', message: 'error' }, undefined, undefined);
    });

    test('When pidWarn is called, it should call Warn with a pid', () => {
      jest.spyOn(pidLogger, 'warn');
      pidLogger.pidWarn('02', 'warn');
      expect(pidLogger.warn).toBeCalledWith({ pid: '02', message: 'warn' });
    });

    test('When pidLog is called, it should call Log with a pid', () => {
      jest.spyOn(pidLogger, 'log');
      pidLogger.pidLog('03', 'log');
      expect(pidLogger.log).toBeCalledWith({ pid: '03', message: 'log' });
    });

    test('When pidVerbose is called, it should call Verbose with a pid', () => {
      jest.spyOn(pidLogger, 'verbose');
      pidLogger.pidVerbose('04', 'verbose');
      expect(pidLogger.verbose).toBeCalledWith({ pid: '04', message: 'verbose' });
    });

    test('When pidDebug is called, it should call debug with a pid', () => {
      jest.spyOn(pidLogger, 'debug');
      pidLogger.pidDebug('05', 'debug');
      expect(pidLogger.debug).toBeCalledWith({ pid: '05', message: 'debug' });
    });
  });
});

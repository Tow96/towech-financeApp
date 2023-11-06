/** winston.logger.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Logger class that adds writing logs with pid and custom format
 */
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import 'winston-daily-rotate-file';
import * as winston from 'winston';

@Injectable()
export class AuthenticationPidWinstonLogger extends Logger {
  static logsFolder = `${__dirname}/../logs`;

  /**
   * Calls an error log with a pid
   * @param {string} pid The id of the log
   * @param {string} message The message of the log
   */
  pidError(pid: string, message: string, stack?: string, context?: string) {
    return this.error({ pid, message }, stack, context);
  }

  /**
   * Calls a warning log with a pid
   * @param {string} pid The id of the log
   * @param {string} message The message of the log
   */
  pidWarn(pid: string, message: string) {
    return this.warn({ pid, message });
  }

  /**
   * Calls a regular log with a pid
   * @param {string} pid The id of the log
   * @param {string} message The message of the log
   */
  pidLog(pid: string, message: string) {
    return this.log({ pid, message });
  }

  /**
   * Calls a verbose log with a pid
   * @param {string} pid The id of the log
   * @param {string} message The message of the log
   */
  pidVerbose(pid: string, message: string) {
    return this.verbose({ pid, message });
  }

  /**
   * Calls a debug log with a pid
   * @param {string} pid The id of the log
   * @param {string} message The message of the log
   */
  pidDebug(pid: string, message: string) {
    return this.debug({ pid, message });
  }

  /**
   * @returns {winston.Logform.Format} The format of the logs
   */
  static format(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
      winston.format.printf(info => AuthenticationPidWinstonLogger.getFormattedOutput(info))
    );
  }

  static getFormattedOutput(info: winston.Logform.TransformableInfo): string {
    const timestamp = info['timestamp'];
    const pid = `${info['pid'] ? ' {pid: ' + info['pid'] + '}' : ''}`;
    const name = `[${process.env['NAME'] || 'UNNAMED APP'}]`;
    const level = info.level;
    const msg = info.message;

    return `${timestamp}${pid} ${name} ${level}: ${msg}`;
  }

  /**
   * @returns {winston.Logform.Format} The transports that will be used
   */
  static transports(): winston.transport[] {
    const silent =
      process.env['DISABLE_LOGGING'] === undefined
        ? false
        : process.env['DISABLE_LOGGING'].toLowerCase() === 'true';

    const consoleTransport = new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        AuthenticationPidWinstonLogger.format()
      ),
    });

    if (silent) return [consoleTransport];

    // The transports are declared after, so the file are not created if not needed
    const errorLogTransport = new winston.transports.DailyRotateFile({
      level: 'warn',
      maxFiles: '30d',
      filename: `${AuthenticationPidWinstonLogger.logsFolder}/error_%DATE%.log`,
      datePattern: 'YYYYMMDD',
      format: AuthenticationPidWinstonLogger.format(),
      zippedArchive: true,
    });

    const combinedLogTransport = new winston.transports.DailyRotateFile({
      level: 'verbose',
      maxFiles: '30d',
      filename: `${AuthenticationPidWinstonLogger.logsFolder}/combined_%DATE%.log`,
      datePattern: 'YYYYMMDD',
      format: AuthenticationPidWinstonLogger.format(),
      zippedArchive: true,
    });

    return [consoleTransport, errorLogTransport, combinedLogTransport];
  }
}

/** winston.logger.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Logger class that adds writing logs with pid and custom format
 */
import { Logger } from '@nestjs/common';
import 'winston-daily-rotate-file';
import * as winston from 'winston';

export class PidWinstonLogger extends Logger {
  static logsFolder = `${__dirname}/../logs`;

  pidError(pid: string, message: string, stack?: string, context?: string) {
    return this.error({ pid, message }, stack, context);
  }

  pidWarn(pid: string, message: string) {
    return this.warn({ pid, message });
  }

  pidLog(pid: string, message: string) {
    return this.log({ pid, message });
  }

  pidVerbose(pid: string, message: string) {
    return this.verbose({ pid, message });
  }

  pidDebug(pid: string, message: string) {
    return this.debug({ pid, message });
  }

  private static format(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
      winston.format.printf(info => PidWinstonLogger.getFormattedOutput(info))
    );
  }

  public static getFormattedOutput(info: winston.Logform.TransformableInfo): string {
    const timestamp = info.timestamp;
    const pid = `${info.pid ? ' {pid: ' + info.pid + '}' : ''}`;
    const name = `[${process.env.NAME || 'UNNAMED APP'}]`;
    const level = info.level;
    const msg = info.message;

    return `${timestamp}${pid} ${name} ${level}: ${msg}`;
  }

  static transports(): winston.transport[] {
    const silent =
      process.env.DISABLE_LOGGING === undefined
        ? false
        : process.env.DISABLE_LOGGING.toLowerCase() === 'true';

    const consoleTransport = new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        PidWinstonLogger.format()
      ),
    });

    if (silent) return [consoleTransport];

    // The transports are declared after, so the file are not created if not needed
    const errorLogTransport = new winston.transports.DailyRotateFile({
      level: 'warn',
      maxFiles: '30d',
      filename: `${PidWinstonLogger.logsFolder}/error_%DATE%.log`,
      datePattern: 'YYYYMMDD',
      format: PidWinstonLogger.format(),
      zippedArchive: true,
    });

    const combinedLogTransport = new winston.transports.DailyRotateFile({
      level: 'verbose',
      maxFiles: '30d',
      filename: `${PidWinstonLogger.logsFolder}/combined_%DATE%.log`,
      datePattern: 'YYYYMMDD',
      format: PidWinstonLogger.format(),
      zippedArchive: true,
    });

    return [consoleTransport, errorLogTransport, combinedLogTransport];
  }
}

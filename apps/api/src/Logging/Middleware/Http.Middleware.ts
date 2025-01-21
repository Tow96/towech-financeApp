import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

// Logs the http calls
export class HttpLogMiddleware implements NestMiddleware {
  private readonly _logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl: url } = req;
    this._logger.debug(`${method} ${url} called`, 'Incoming Request');

    res.on('close', () => {
      const { statusCode } = res;

      this._logger.log(`${method} ${url} - ${statusCode}`, 'Request Response');
    });

    next();
  }
}

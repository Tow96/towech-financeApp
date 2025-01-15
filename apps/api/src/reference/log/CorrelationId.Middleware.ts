import { v4 as uuidV4 } from 'uuid';
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export const CORRELATION_ID_HEADER = 'X-Correlation-Id';

export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = uuidV4();

    req.headers[CORRELATION_ID_HEADER] = id;
    res.set(CORRELATION_ID_HEADER, id);

    next();
  }
}

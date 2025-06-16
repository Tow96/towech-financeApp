import { v4 as uuidV4 } from 'uuid';
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

export const CORRELATION_ID_HEADER = 'X-Correlation-Id';

export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const id = uuidV4() as string; // Generates a correlation id

    // Adds the correlation id to both the request and the response
    req.headers[CORRELATION_ID_HEADER] = id;
    res.set(CORRELATION_ID_HEADER, id);
    next();
  }
}
/** log-id.middleware.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Middleware that adds a random uuid for logging purposes
 */
// Libaries
import { randomUUID } from 'crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
// Models
import { LogIdRequest } from './log-id.model';

@Injectable()
export class LogIdMiddleware implements NestMiddleware {
  public use(req: LogIdRequest, res: Response, next: NextFunction) {
    const id = randomUUID();
    req.logId = id;
    res.set('logId', id);
    next();
  }
}

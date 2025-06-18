import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Filters
    switch (true) {
      // NestJs exceptions
      case exception instanceof HttpException:
        return response.status(exception.getStatus()).send(exception.getResponse());

      default:
        this.logger.error(`Unknown exception: ${JSON.stringify(exception)}`);
        return response.status(500).send('internal server error');
    }
  }
}
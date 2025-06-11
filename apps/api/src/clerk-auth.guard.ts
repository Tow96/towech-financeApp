import clerkClient from '@clerk/clerk-sdk-node';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      await clerkClient.verifyToken(request.headers.authorization);
    } catch (e) {
      this.logger.error(e);
      return false;
    }
    return true;
  }
}

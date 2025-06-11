import clerkClient from '@clerk/clerk-sdk-node';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || '';
    const authorization = authHeader.split('Bearer ');
    if (authorization.length < 2) return false;

    try {
      await clerkClient.verifyToken(authorization[1]);
    } catch (e) {
      this.logger.error(e);
      return false;
    }
    return true;
  }
}

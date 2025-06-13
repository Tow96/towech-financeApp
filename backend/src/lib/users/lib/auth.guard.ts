import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE_KEY } from './public-route.decorator';
import { UserService } from './user.service';
import { User } from '../core/user.entity';

interface ExtendedRequest extends Request {
  user: User | null;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ExtendedRequest>();
    const token = (req.headers['authorization'] as string).split(' ').pop() || '';

    // Check if the Public decorator was used.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const user = await this.userService.validateJwt(token);
    req.user = user;

    return !!user;
  }
}

import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { User } from '../core/user.entity';

interface ExtendedRequest extends Request {
  user: User | null;
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): User | null => {
    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    return request.user;
  }
);

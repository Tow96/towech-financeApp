import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { User } from '../core/user.entity';

export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});

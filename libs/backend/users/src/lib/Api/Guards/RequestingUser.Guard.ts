import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthorizationService, AuthResults } from '@financeapp/backend-authorization';

@Injectable()
export class RequestingUserGuard implements CanActivate {
  constructor(private readonly _authorizationService: AuthorizationService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const header = request.header('Authorization') || '';

    const token = header.split('Bearer ')[1];
    const userId = params.userId;

    return this._authorizationService.isRequestingUser(token, userId) === AuthResults.PASS;
  }
}

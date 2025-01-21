import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthorizationService, AuthResults } from '../../Core/Application/Authorization.Service';

@Injectable()
export class AdminRequestingUserGuard implements CanActivate {
  constructor(private readonly _authorizationService: AuthorizationService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const header = request.header('Authorization') || '';

    const token = header.split('Bearer ')[1];
    const userId = params.userId;

    return this._authorizationService.isAdminOrRequestingUser(token, userId) === AuthResults.PASS;
  }
}

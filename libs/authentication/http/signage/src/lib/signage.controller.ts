import { Controller, Post } from '@nestjs/common';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';

export enum SIGNAGE_ROUTES {
  REGISTER = 'register',
  LOGIN = 'login',
}

@Controller()
export class SignageController {
  constructor(private readonly users: AuthenticationUserService) {}

  // TODO: Swagger
  // TODO: I18n
  // TODO: Guard
  // TODO: Dto
  @Post(SIGNAGE_ROUTES.REGISTER)
  public register() {
    return this.users.register();
  }

  // TODO: Swagger
  // TODO: I18n
  // TODO: Guard
  // TODO: Dto
  @Post(SIGNAGE_ROUTES.LOGIN)
  public login() {
    return this.users.getAll();
  }
}

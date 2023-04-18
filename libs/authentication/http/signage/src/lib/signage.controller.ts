import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
import { CreateUserDto } from '@towech-finance/authentication/dto';

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
  // TODO: Logs
  @Post(SIGNAGE_ROUTES.REGISTER)
  public register(@Body() user: CreateUserDto) {
    return user;
  }

  // TODO: Swagger
  // TODO: I18n
  // TODO: Guard
  // TODO: Dto
  // TODO: Logs
  @Post(SIGNAGE_ROUTES.LOGIN)
  public login() {
    return this.users.getAll();
  }
}

import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
import { CreateUserDto } from '@towech-finance/authentication/dto';
import { LogId, PidWinstonLogger } from '@towech-finance/shared/features/logger';
import { UserModel } from '@towech-finance/shared/utils/models';

export enum SIGNAGE_ROUTES {
  REGISTER = 'register',
  LOGIN = 'login',
}

@Controller()
export class SignageController {
  constructor(
    private readonly userRepo: AuthenticationUserService,
    private readonly logger: PidWinstonLogger
  ) {}

  // TODO: Swagger
  // TODO: I18n
  // TODO: Guard
  @Post(SIGNAGE_ROUTES.REGISTER)
  public async register(@Body() user: CreateUserDto, @LogId() logId: string): Promise<UserModel> {
    this.logger.pidLog(logId, `Registering new user under email ${user.mail}`);

    const password = Math.random().toString(36).substring(2, 10);
    this.logger.pidDebug(logId, password);

    try {
      const newUser = await this.userRepo.register(user.name, password, user.mail, user.role);
      this.logger.pidLog(logId, `Registered new user with id ${newUser._id}`);

      // TODO: Send registration email

      return newUser;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  // TODO: Swagger
  // TODO: I18n
  // TODO: Guard
  // TODO: Dto
  // TODO: Logs
  @Post(SIGNAGE_ROUTES.LOGIN)
  public login() {
    return this.userRepo.getAll();
  }
}

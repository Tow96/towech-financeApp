// Libraries
import { Body, Controller, HttpException, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
// Services
import { AuthenticationUserService } from '@towech-finance/authentication/repos/user';
import { AuthenticationTokenService } from '@towech-finance/authentication/tokens';
import { LogId, PidWinstonLogger } from '@towech-finance/shared/features/logger';
// Models
import { CreateUserDto, LoginDto } from '@towech-finance/authentication/dto';
import { UserModel } from '@towech-finance/shared/utils/models';
// Guards
import { LocalAuthGuard, User } from '@towech-finance/authentication/passport';
import { ConfigService } from '@nestjs/config';

export enum SIGNAGE_ROUTES {
  REGISTER = 'register',
  LOGIN = 'login',
}

@Controller()
export class SignageController {
  constructor(
    private readonly userRepo: AuthenticationUserService,
    private readonly tokens: AuthenticationTokenService,
    private readonly logger: PidWinstonLogger,
    private readonly config: ConfigService
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
  @UseGuards(LocalAuthGuard)
  @Post(SIGNAGE_ROUTES.LOGIN)
  public async login(
    @User() user: UserModel,
    @Body() body: LoginDto,
    @LogId() logId: string,
    @Res({ passthrough: true }) res
  ): Promise<{ token: string }> {
    this.logger.pidLog(logId, `Logging in user: ${user._id}`);

    const refreshToken = this.tokens.generateRefreshToken(user);
    const authToken = this.tokens.generateAuthToken(user);
    this.logger.pidLog(logId, `Generated tokens`);

    this.userRepo.storeRefreshToken(user._id, refreshToken.id, body.keepSession);
    this.logger.pidLog(logId, `Stored refresh token`);

    const now = new Date();
    const expiration = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    const cookieOptions = {
      httpOnly: true,
      expires: body.keepSession ? expiration : undefined,
      secure: isProd ? true : undefined,
    };

    res.cookie('jid', refreshToken.token, cookieOptions);
    this.logger.pidLog(logId, `Generated cookie`);

    return { token: authToken };
  }
}

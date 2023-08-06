import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// Services
import { ConfigService } from '@nestjs/config';
import { LogId, PidWinstonLogger } from '@finance/authentication/shared/feature-logger';
import { AuthenticationFeatureSessionsDataAccessUserService } from '@finance/authentication/feature-sessions/data-access-user';
import { AuthenticationFeatureSessionsDataAccessJwtService } from '@finance/authentication/feature-sessions/data-access-jwt';
// Guards
import {
  JwtAuthAdminGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
  Refresh,
  User,
} from '@finance/authentication/feature-sessions/utils-guards';
// Models
import { CreateUserDto, LoginDto } from '@finance/authentication/feature-sessions/utils-dto';
import { AuthToken, RefreshToken, UserModel } from '@finance/shared/utils-types';
import { Response, CookieOptions } from 'express';

enum SIGNAGE_ROUTES {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REFRESH = 'refresh',
  REGISTER = 'register',
}

enum COOKIES {
  REFRESH = 'jid',
}

@Controller()
@ApiTags('')
export class AuthenticationFeatureSessionsHttpController {
  // TODO: I18n
  @UseGuards(LocalAuthGuard)
  @Post(SIGNAGE_ROUTES.LOGIN)
  @ApiOperation({ summary: 'Creates the authToken and the refreshToken cookie for a user' })
  public async login(
    @User() user: UserModel,
    @Body() body: LoginDto,
    @LogId() logId: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthToken> {
    this.logger.pidLog(logId, `Logging in user: ${user._id}`);

    const refreshToken = this.tokens.generateRefreshToken(user, body.keepSession);
    const authToken = this.tokens.generateAuthToken(user);
    this.logger.pidLog(logId, `Generated tokens`);

    this.user.storeRefreshToken(user._id, refreshToken.id, body.keepSession);
    this.logger.pidLog(logId, `Stored refresh token`);

    const now = new Date();
    const expiration = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      expires: body.keepSession ? expiration : undefined,
      secure: isProd ? true : undefined,
    };

    res.cookie(COOKIES.REFRESH, refreshToken.token, cookieOptions);
    this.logger.pidLog(logId, `Generated cookie`);

    return { token: authToken };
  }

  // TODO: I18n
  @UseGuards(JwtRefreshGuard)
  @Post(SIGNAGE_ROUTES.LOGOUT)
  @HttpCode(204)
  @ApiOperation({ summary: 'Deregisters and removes a refreshToken cookie for a user' })
  public async logout(
    @Refresh() { id, user }: RefreshToken,
    @LogId() logId: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    this.logger.pidLog(logId, `Logging user: ${user._id} out`);
    this.user.removeRefreshToken(user._id, id);

    this.logger.pidLog(logId, `Removing cookie`);
    res.clearCookie(COOKIES.REFRESH);
  }

  // TODO: I18n
  @UseGuards(JwtRefreshGuard)
  @Post(SIGNAGE_ROUTES.REFRESH)
  @ApiOperation({ summary: 'Reads the refreshToken cookie to generate a new authToken' })
  public async refresh(
    @Refresh() { user }: RefreshToken,
    @LogId() logId: string
  ): Promise<AuthToken> {
    this.logger.pidLog(logId, `Generating new token for user: ${user._id}`);
    const token = this.tokens.generateAuthToken(user);
    return { token };
  }

  // TODO: I18n
  @UseGuards(JwtAuthAdminGuard)
  @Post(SIGNAGE_ROUTES.REGISTER)
  @ApiOperation({ summary: 'Registers a new user to the application, only admins can call it' })
  @ApiBearerAuth('access-token')
  public async register(@Body() user: CreateUserDto, @LogId() logId: string): Promise<UserModel> {
    this.logger.pidLog(logId, `Registering new user under email ${user.mail}`);

    const password = Math.random().toString(36).substring(2, 10);
    this.logger.pidDebug(logId, password);

    try {
      const newUser = await this.user.register(user.name, password, user.mail, user.role);
      this.logger.pidLog(logId, `Registered new user with id ${newUser._id}`);

      // TODO: Send registration email

      return newUser;
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  public constructor(
    private readonly user: AuthenticationFeatureSessionsDataAccessUserService,
    private readonly tokens: AuthenticationFeatureSessionsDataAccessJwtService,
    private readonly logger: PidWinstonLogger,
    private readonly config: ConfigService
  ) {}
}

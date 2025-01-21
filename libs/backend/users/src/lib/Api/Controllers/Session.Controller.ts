import { Response, Request } from 'express';

import { Body, Controller, Logger, Param, Post, Req, Res, UseGuards } from '@nestjs/common';

import { LoginDto } from '../Validation/Login.Dto';
import { AuthDto } from '../../Core/Application/Authorization.Service';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';
import { SessionService } from '../../Core/Application/Session.Service';

const SESSION_COOKIE = 'jid';

@Controller('new')
export class SessionController {
  private readonly _logger = new Logger(SessionController.name);
  constructor(private readonly _sessionService: SessionService) {}

  private setSessionCookie(res: Response, sessionId: string, expiration: Date) {
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      path: '/',
      secure: false, // TODO: set up SSL
      sameSite: 'none', // TODO: set up same-site
      expires: expiration,
    });
  }

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthDto> {
    // TODO: Add throttling

    const out = await this._sessionService.login(data.email, data.password, data.keepSession);

    this._logger.log('Creating session cookie');
    this.setSessionCookie(response, out.token, out.model.expiresAt);

    return out.auth;
  }

  @Post('/refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthDto> {
    this._logger.log('Validating session');
    const sessionToken = req.cookies[SESSION_COOKIE];
    try {
      const out = await this._sessionService.refresh(sessionToken);
      this.setSessionCookie(res, out.token, out.model.expiresAt);
      return out.auth;
    } catch (e) {
      this.setSessionCookie(res, '', new Date(0));
      throw e;
    }
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    this._logger.log('Removing session cookie');
    this.setSessionCookie(res, '', new Date(0));

    return this._sessionService.logout(req.cookies[SESSION_COOKIE]);
  }

  @Post('/logout-all/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async logoutAllSessions(@Param('userId') userId: string): Promise<void> {
    return this._sessionService.logoutAll(userId);
  }
}

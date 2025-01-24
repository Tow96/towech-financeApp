import { Response, Request } from 'express';
import { Body, Controller, Param, Post, Req, Res, UseGuards } from '@nestjs/common';

// Guards
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

// Services
import { SessionCommands } from '../../Core/Application/Commands/Session.Commands';
import { TokenDto } from '../../Core/Application/Authorization.Service';

// Validation
import { LoginDto } from '../Validation/Login.Dto';

const SESSION_COOKIE = 'jid';

@Controller('new')
export class SessionController {
  constructor(private readonly _sessionCommands: SessionCommands) {}

  // TODO: Set session cookie safety and CSRF
  private setSessionCookie(res: Response, sessionId: string, expiration: Date) {
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      path: '/',
      secure: false,
      sameSite: 'none',
      expires: expiration,
    });
  }

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<TokenDto> {
    const session = await this._sessionCommands.createSession(
      data.email,
      data.password,
      data.keepSession
    );
    this.setSessionCookie(response, session.id, session.expiration);

    return session.auth;
  }

  @Post('/refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<TokenDto> {
    const sessionId = req.cookies[SESSION_COOKIE];

    const session = await this._sessionCommands.refreshSession(sessionId);
    this.setSessionCookie(res, session.id, session.expiration);

    return session.auth;
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this._sessionCommands.deleteSession(req.cookies[SESSION_COOKIE]);
    this.setSessionCookie(res, '', new Date(0));
  }

  @Post('/logout-all/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async logoutAllSessions(@Param('userId') userId: string): Promise<void> {
    return this._sessionCommands.deleteAllUserSessions(userId);
  }
}
// 73

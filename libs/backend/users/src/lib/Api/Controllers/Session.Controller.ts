import { Response, Request } from 'express';
import { Body, Controller, Param, Post, Req, Res, UseGuards } from '@nestjs/common';

// Guards
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

// Services
import { UserService } from '../../Core/Application/User.Service';

// Validation
import { LoginDto } from '../Validation/Login.Dto';
import { TokenDto } from '../../Core/Application/Authorization.Service';

const SESSION_COOKIE = 'jid';

// TODO: Set CSRF
@Controller('new')
export class SessionController {
  constructor(private readonly _userService: UserService) {}

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
  ): Promise<TokenDto> {
    // TODO: Add throttling

    const session = await this._userService.createSession(
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

    const session = await this._userService.refreshSession(sessionId);
    this.setSessionCookie(res, session.id, session.expiration);

    return session.auth;
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this._userService.deleteSession(req.cookies[SESSION_COOKIE]);
    this.setSessionCookie(res, '', new Date(0));
  }

  @Post('/logout-all/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async logoutAllSessions(@Param('userId') userId: string): Promise<void> {
    return this._userService.deleteAllUserSessions(userId);
  }
}

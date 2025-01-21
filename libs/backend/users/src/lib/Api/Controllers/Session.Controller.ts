import { verifySync } from '@node-rs/argon2';
import { Response, Request } from 'express';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '../../fake-oslo/encoding';

import {
  Body,
  Controller,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LoginDto } from '../Validation/Login.Dto';
import { UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';
import { sha256 } from '../../fake-oslo/crypto/sha2';
import { SessionModel, SessionsRepository } from '../../Database/Repositories/Sessions.Repository';
import { AuthDto, AuthorizationService } from '../../Core/Application/Authorization.Service';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

const SESSION_COOKIE = 'jid';
const TEMPORARY_SESSION_DURATION = 1000 * 60 * 30; // 30 min
const PERMANENT_SESSION_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days
const generateSessionExpiration = (isPermanent: boolean) =>
  new Date(Date.now() + (isPermanent ? PERMANENT_SESSION_DURATION : TEMPORARY_SESSION_DURATION));

const encodeToken = (token: string): string =>
  encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

@Controller('new')
export class SessionController {
  private readonly _logger = new Logger(SessionController.name);
  constructor(
    private readonly _authorizationService: AuthorizationService,
    private readonly _userInfoRepository: UserInfoRepository,
    private readonly _sessionRepository: SessionsRepository
  ) {}

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

    this._logger.log('Validating user');
    const userExists = await this._userInfoRepository.getByEmail(data.email);
    if (!userExists) throw new UnauthorizedException('Invalid credentials.');

    this._logger.log('Validating password');
    if (!verifySync(userExists.passwordHash, data.password))
      throw new UnauthorizedException('Invalid credentials.');

    this._logger.log('Creating session');
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const sessionToken = encodeBase32LowerCaseNoPadding(tokenBytes);
    const newSession: SessionModel = {
      id: encodeToken(sessionToken),
      userId: userExists.id,
      expiresAt: generateSessionExpiration(data.keepSession),
      permanentSession: data.keepSession,
    };
    this._logger.verbose(`SESSION_TOKEN: ${sessionToken}`);

    this._logger.log('Storing session');
    await this._sessionRepository.insert(newSession);

    this._logger.log('Creating session cookie');
    this.setSessionCookie(response, sessionToken, newSession.expiresAt);

    this._logger.log('Generating auth-token');
    return this._authorizationService.generateAuthToken(userExists);
  }

  @Post('/refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthDto> {
    this._logger.log('Validating session');
    const sessionToken = req.cookies[SESSION_COOKIE];
    const sessionId = encodeToken(req.cookies[SESSION_COOKIE]);
    let session = await this._sessionRepository.getById(sessionId);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    this._logger.log('Validating user');
    const userExists = await this._userInfoRepository.getById(session.userId);
    if (!userExists) throw new UnauthorizedException('Invalid credentials.');

    // Delete session if expired
    if (Date.now() >= session.expiresAt.getTime()) {
      this._logger.log('Expired session, deleting');
      await this._sessionRepository.delete(session);
      this.setSessionCookie(res, '', new Date(0));
      throw new UnauthorizedException('Invalid credentials');
    }

    // Refresh session if its expiration is less than half than the duration
    const tresholdTime =
      session.expiresAt.getTime() -
      (session.permanentSession ? PERMANENT_SESSION_DURATION : TEMPORARY_SESSION_DURATION) / 2;
    if (Date.now() > tresholdTime) {
      this._logger.log('Refreshing session');
      session = { ...session, expiresAt: generateSessionExpiration(session.permanentSession) };
      await this._sessionRepository.update(session);
      this.setSessionCookie(res, sessionToken, session.expiresAt);
    }

    this._logger.log('Generating auth-token');
    return this._authorizationService.generateAuthToken(userExists);
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    // Invalidate session
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(req.cookies[SESSION_COOKIE]))
    );
    this._logger.log('Removing session cookie');
    this.setSessionCookie(res, '', new Date(0));

    this._logger.log('Validating session');
    const session = await this._sessionRepository.getById(sessionId);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    this._logger.log('Deleting session');
    await this._sessionRepository.delete(session);
  }

  @Post('/logout-all/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async logoutAllSessions(@Param('userId') userId: string): Promise<void> {
    this._logger.log('Retrieving user');
    const userExists = this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found');

    this._logger.log('Deleting sessions');
    await this._sessionRepository.deleteAll(userId);
  }
}
// 182

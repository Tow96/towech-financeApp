import { verifySync } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Response, Request } from 'express';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '../../fake-oslo/encoding';

import {
  Body,
  Controller,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { LoginDto } from '../Validation/Login.Dto';
import { UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';
import { UsersSchema } from '../../Database/Users.Schema';
import { sha256 } from '../../fake-oslo/crypto/sha2';
import { SessionModel, SessionsRepository } from '../../Database/Repositories/Sessions.Repository';

// TODO: Expired session cleanup-job
const SESSION_COOKIE = 'jid';

@Controller('new')
export class SessionController {
  private readonly _logger = new Logger(SessionController.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>,
    private readonly _userInfoRepository: UserInfoRepository,
    private readonly _sessionRepository: SessionsRepository
  ) {}

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<void> {
    // TODO: Add throttling

    const userExists = await this._userInfoRepository.getByEmail(data.email);
    if (!userExists) throw new UnauthorizedException('Invalid credentials.');

    // Validate password
    if (!verifySync(userExists.passwordHash, data.password))
      throw new UnauthorizedException('Invalid credentials.');

    // Generate session id
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const sessionToken = encodeBase32LowerCaseNoPadding(tokenBytes);
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));

    // Set expiration
    const expiration = data.keepSession
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30d if session is kept
      : new Date(Date.now() + 30 * 60 * 1000); // 30m if session is not kept

    // Create session
    // TODO: limit the amount of sessions per user
    const newSession: SessionModel = {
      id: sessionId,
      userId: userExists.id,
      expiresAt: expiration,
      permanentSession: data.keepSession,
    };
    await this._sessionRepository.insert(newSession);

    // Generate cookie
    response.cookie(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      path: '/',
      secure: false, // TODO: set up SSL
      sameSite: 'none', // TODO: set up same-site
      expires: expiration,
    });

    // TODO: Generate auth_key
    return;
  }

  @Post('/refresh')
  // TODO: Cookie guard
  async refreshToken(@Req() req: Request): Promise<void> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(req.cookies[SESSION_COOKIE]))
    );

    let session = await this._sessionRepository.getById(sessionId);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    // Delete session if expired
    if (Date.now() >= session.expiresAt.getTime()) {
      await this._sessionRepository.delete(session);
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionExpiration = session.permanentSession
      ? 30 * 24 * 60 * 60 * 1000 // 30d if permanent
      : 30 * 60 * 1000; // 30m if temporary

    // Refresh session
    if (Date.now() >= session.expiresAt.getTime() - sessionExpiration / 2) {
      session = { ...session, expiresAt: new Date(Date.now() + sessionExpiration) };
      await this._sessionRepository.update(session);
    }

    // TODO: Generate auth_key

    return;
  }

  @Post('/logout')
  // TODO: Cookie guard
  async logout(@Req() req: Request): Promise<void> {
    // Invalidate session
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(req.cookies[SESSION_COOKIE]))
    );

    const session = await this._sessionRepository.getById(sessionId);
    if (!session) throw new UnauthorizedException('Invalid credentials');

    // Delete session
    await this._sessionRepository.delete(session);
  }

  @Post('/logout-all/:id')
  // TODO: user/admin guard
  async logoutAllSessions(@Param('id') userId: string): Promise<void> {
    // Invalidate all sessions
    const userExists = this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found');

    await this._sessionRepository.deleteAll(userId);
  }
}

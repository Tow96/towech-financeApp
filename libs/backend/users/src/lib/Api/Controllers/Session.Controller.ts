import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../Validation/Login.Dto';

@Controller()
export class SessionController {
  @Post('login')
  async login(@Body() data: LoginDto): Promise<void> {
    // TODO: Validate password

    // TODO: Generate session (FIFO)

    // TODO: Generate cookie

    // TODO: Generate auth_key
    return;
  }

  @Post('refresh')
  // TODO: Cookie guard
  async refreshToken(): Promise<void> {
    // TODO: Refresh session

    // TODO: Generate auth_key

    return;
  }

  @Post('logout')
  // TODO: Cookie guard
  async logout(): Promise<void> {
    // TODO: Invalidate session

    // TODO: Delete cookie
    return;
  }

  @Post('logout-all')
  // TODO: user/admin guard
  async logoutAllSessions(): Promise<void> {
    // TODO: Invalidate all sessions

    // TODO: Delete cookie
    return;
  }
}

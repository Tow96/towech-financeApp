import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClerkClient, createClerkClient } from '@clerk/backend';
import { User } from '../core/user.entity';
import { User as ClerkUser, verifyToken } from '@clerk/backend';

@Injectable()
export class UserService {
  private readonly UsersDisabled: boolean;
  private readonly ClerkClient: ClerkClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {
    this.UsersDisabled = this.configService.get('USERS_DISABLED') === 'true';

    this.ClerkClient = createClerkClient({
      publishableKey: configService.get('CLERK_PUBLISHABLE_KEY'),
      secretKey: configService.get('CLERK_SECRET_KEY'),
    });
  }

  public async validateJwt(token: string): Promise<User | null> {
    if (this.UsersDisabled) return new User({ id: 'TestingUser' } as ClerkUser);

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get('CLERK_SECRET_KEY'),
      });

      const clerkUser = await this.ClerkClient.users.getUser(tokenPayload.sub);
      return new User(clerkUser);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}

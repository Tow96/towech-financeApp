import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ClerkClientProvider } from '../users/user.service';
import { AuthModule } from '../users/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from '../users/clerk-auth.guard';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}

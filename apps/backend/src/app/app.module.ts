import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

// Modules
import { LoggingModule } from './logging/logging.module';
import { UsersModule } from '@/lib/users';
import { CategoryModule } from '@/lib/categories';
import { WalletModule } from '@/lib/wallets';
import { MovementModule } from '@/lib/movements';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    LoggingModule,
    UsersModule,
    CategoryModule,
    WalletModule,
    MovementModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

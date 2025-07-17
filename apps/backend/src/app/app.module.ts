import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

// Modules
import { LoggingModule } from './logging/logging.module';
import { UsersModule } from '@/lib/users';
import { CategoryModule } from '@/lib/categories';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    LoggingModule,
    UsersModule,
    CategoryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

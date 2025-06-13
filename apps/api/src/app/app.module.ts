import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from '@financeapp/users-backend';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UserController } from './Api/Controllers/User.Controller';
import { DrizzleProvider, DATABASE_CONNECTION } from './Database/drizzle.provider';
import { UserService } from './Core/User.Service';

@Module({
  controllers: [UserController],
  providers: [DrizzleProvider, UserService],
  exports: [DATABASE_CONNECTION],
})
export class UsersModule {}

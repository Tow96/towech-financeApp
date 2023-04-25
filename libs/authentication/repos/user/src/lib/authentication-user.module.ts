// Libraries
import { Module } from '@nestjs/common';
// Modules
import { MongooseModule } from '@nestjs/mongoose';
// Providers
import { AuthenticationUserService, UserSchema, UserDocument } from './authentication-user.service';

@Module({
  controllers: [],
  imports: [MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }])],
  providers: [AuthenticationUserService],
  exports: [AuthenticationUserService],
})
export class AuthenticationReposUserModule {}

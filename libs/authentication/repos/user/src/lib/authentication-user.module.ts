import { Module } from '@nestjs/common';
import { AuthenticationUserService, UserSchema, UserDocument } from './authentication-user.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [],
  imports: [MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }])],
  providers: [AuthenticationUserService],
  exports: [AuthenticationUserService],
})
export class AuthenticationReposUserModule {}

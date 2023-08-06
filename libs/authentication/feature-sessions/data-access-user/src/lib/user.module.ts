/** data-access-user.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Module that manages the routes that handle the connection to the user collection
 */
// Libraries
import { Module } from '@nestjs/common';
// Modules
import { MongooseModule } from '@nestjs/mongoose';
// Services
import { AuthenticationSessionsUserService } from './user.service';
// Models
import { UserDocument, UserSchema } from './utils/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }])],
  providers: [AuthenticationSessionsUserService],
  exports: [AuthenticationSessionsUserService],
})
export class AuthenticationSessionsUserModule {}

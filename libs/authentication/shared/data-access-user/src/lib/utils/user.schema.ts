/** user.schema.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Schema to connect to the MongoDb collection
 */
// Libraries
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@finance/authentication/shared/data-access-mongo';
// Modes
import { UserRoles } from '@finance/shared/utils-types';

// TODO: Set storage conditions
@Schema({ versionKey: false, collection: 'users' })
export class UserDocument extends BaseSchema {
  @Prop({ type: String, required: true })
  name = '';

  @Prop({ type: String, required: true })
  mail = '';

  @Prop({ type: String, required: true })
  password = '';

  @Prop({ type: String, required: true })
  role: UserRoles = UserRoles.USER;

  @Prop({ type: Boolean, default: false })
  accountConfirmed = false;

  @Prop({ type: Array, default: [] })
  refreshTokens: string[] = [];

  @Prop({ type: String, required: false })
  singleSessionToken?: string;

  @Prop({ type: String, required: false })
  resetToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

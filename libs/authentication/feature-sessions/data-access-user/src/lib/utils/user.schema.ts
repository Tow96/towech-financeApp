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
// @Schema({ versionKey: false, collection: 'users' })
// export class UserDocument extends BaseSchema {
export class UserDocument {
  // @Prop({ type: String, required: true })
  public name = '';

  //  @Prop({ type: String, required: true })
  public mail = '';

  //  @Prop({ type: String, required: true })
  public password = '';

  //  @Prop({ type: String, required: true })
  public role: UserRoles = UserRoles.USER;

  //   @Prop({ type: Boolean, default: false })
  public accountConfirmed = false;

  //   @Prop({ type: Array, default: [] })
  public refreshTokens: string[] = [];

  //  @Prop({ type: String, required: false })
  public singleSessionToken?: string;

  //  @Prop({ type: String, required: false })
  public resetToken?: string;
}

// export const UserSchema = SchemaFactory.createForClass(UserDocument);

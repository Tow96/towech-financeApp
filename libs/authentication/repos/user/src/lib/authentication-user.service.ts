import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, BaseRepository } from '@towech-finance/shared/features/mongo';
import { Model } from 'mongoose';
import { UserRoles } from '@towech-finance/shared/utils/models';

// TODO: Set conditions
@Schema({ versionKey: false, collection: 'users' })
export class UserDocument extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  mail: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  role: UserRoles;

  @Prop({ type: Boolean, default: false })
  accountConfirmed: boolean;

  @Prop({ type: Array, default: [] })
  refreshToken: string[];

  @Prop({ type: String, required: false })
  singleSessionToken?: string;

  @Prop({ type: String, required: false })
  resetToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

@Injectable()
export class AuthenticationUserService extends BaseRepository<UserDocument> {
  constructor(@InjectModel(UserDocument.name) readonly model: Model<UserDocument>) {
    super(model);
  }

  async register(
    name: string,
    password: string,
    mail: string,
    role: UserRoles = UserRoles.USER
  ): Promise<UserDocument> {
    // TODO: Ensure that the user doesn't already exist

    // TODO: Encrypt password

    // TODO: Send mail

    return this.create({
      accountConfirmed: false,
      mail,
      name,
      password,
      role,
      refreshToken: [],
    });
  }

  async getAll(): Promise<UserDocument[]> {
    return this.find({});
  }
}

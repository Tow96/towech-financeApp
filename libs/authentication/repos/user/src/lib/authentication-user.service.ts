import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, BaseRepository } from '@towech-finance/shared/features/mongo';
import { Model } from 'mongoose';

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
  role: string;

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

  async register(): Promise<UserDocument> {
    return this.create({
      name: 'Tow',
      password: 'ENCRYPTME',
      refreshToken: [],
      accountConfirmed: false,
      role: 'admin',
      mail: 'jose.towe@gmail.com',
    });
  }

  async getAll(): Promise<UserDocument[]> {
    return this.find({});
  }
}

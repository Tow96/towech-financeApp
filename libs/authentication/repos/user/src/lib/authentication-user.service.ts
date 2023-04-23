import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, BaseRepository } from '@towech-finance/shared/features/mongo';
import { Model } from 'mongoose';
import { UserModel, UserRoles } from '@towech-finance/shared/utils/models';

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
  refreshTokens: string[];

  @Prop({ type: String, required: false })
  singleSessionToken?: string;

  @Prop({ type: String, required: false })
  resetToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

@Injectable()
export class AuthenticationUserService extends BaseRepository<UserDocument> {
  private REFRESH_TOKEN_MAX_COUNT = 5;

  constructor(@InjectModel(UserDocument.name) readonly model: Model<UserDocument>) {
    super(model);
  }

  private ConvertUserDocToUser(input: UserDocument | null): UserModel | null {
    if (input === null) return null;

    const output: UserModel = new UserModel(
      input.name,
      input.mail,
      input.role,
      input.accountConfirmed
    );
    return output;
  }

  public async getByEmail(mail: string): Promise<UserModel | null> {
    const user = await this.findOne({ mail });

    return this.ConvertUserDocToUser(user);
  }

  // TODO: i18n
  public async register(
    name: string,
    password: string,
    mail: string,
    role: UserRoles = UserRoles.USER
  ): Promise<UserModel> {
    const userExists = await this.findOne({ mail });
    if (userExists !== null) throw new Error('Mail already registered');

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

    const newUser = await this.create({
      accountConfirmed: false,
      mail,
      name,
      password: hashedPassword,
      role,
      refreshTokens: [],
    });

    return this.ConvertUserDocToUser(newUser);
  }

  public async removeRefreshToken(user_id: string, token: string): Promise<void> {
    const user = await super.findById(user_id);
    if (!user) return null;

    user.refreshTokens = !token ? [] : user.refreshTokens.filter(x => x !== token);
    user.singleSessionToken =
      !token || user.singleSessionToken === token ? undefined : user.singleSessionToken;

    this.findByIdAndUpdate(user_id, {
      refreshTokens: user.refreshTokens,
      singleSessionToken: user.singleSessionToken,
    });
  }

  public async storeRefreshToken(
    user_id: string,
    token: string,
    singleSession = false
  ): Promise<void> {
    const user = await this.findById(user_id);
    if (!user) return;

    if (singleSession) {
      if (user.refreshTokens.length >= this.REFRESH_TOKEN_MAX_COUNT) user.refreshTokens.shift();
      user.refreshTokens.push(token);
    } else {
      user.singleSessionToken = token;
    }

    await this.findByIdAndUpdate(user_id, {
      refreshTokens: user.refreshTokens,
      singleSessionToken: user.singleSessionToken,
    });

    return;
  }

  public async validatePassword(user_id: string, password: string): Promise<boolean> {
    const user = await this.findById(user_id);
    if (!user) return false;

    // Validates password
    return bcrypt.compare(password, user.password);
  }

  // ---------------------------------------------
  async getAll(): Promise<UserDocument[]> {
    return this.find({});
  }
}

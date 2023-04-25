/** authentication-user.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Repository that contains all the logic to interact with the users database,
 */
// Libraries
import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
// Services
import { BaseSchema, BaseRepository } from '@towech-finance/shared/features/mongo';
// Models
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

// TODO: i18n
@Injectable()
export class AuthenticationUserService extends BaseRepository<UserDocument> {
  private REFRESH_TOKEN_MAX_COUNT = 5;

  constructor(@InjectModel(UserDocument.name) readonly model: Model<UserDocument>) {
    super(model);
  }

  private ConvertUserDocToUser(input: UserDocument | null): UserModel | null {
    if (input === null) return null;

    const output: UserModel = new UserModel(
      input._id.toString(),
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

  public async getById(id: Types.ObjectId | string): Promise<UserModel | null> {
    return this.ConvertUserDocToUser(await super.findById(id));
  }

  // TODO: i18n

  /** register
   * Registers a new user to the database
   *
   * @returns The new user
   */
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

  /** removeRefreshToken
   * clears the tokens from a user, if no token is given, all are cleared
   */
  public async removeRefreshToken(user_id: string, token: string | null): Promise<void> {
    const user = await super.findById(user_id);
    if (!user) return null;

    user.refreshTokens = !token
      ? []
      : user.refreshTokens.filter(x => !bcrypt.compareSync(token, x));
    user.singleSessionToken =
      !token || bcrypt.compareSync(token, user.singleSessionToken)
        ? undefined
        : user.singleSessionToken;

    this.findByIdAndUpdate(user_id, {
      refreshTokens: user.refreshTokens,
      singleSessionToken: user.singleSessionToken,
    });
  }

  /** storeRefreshToken
   * Adds a refresh token to the user
   */
  public async storeRefreshToken(
    user_id: string,
    token: string,
    singleSession = false
  ): Promise<void> {
    const user = await this.findById(user_id);
    if (!user) return;

    const hashedToken = bcrypt.hashSync(token, bcrypt.genSaltSync());

    if (singleSession) {
      if (user.refreshTokens.length >= this.REFRESH_TOKEN_MAX_COUNT) user.refreshTokens.shift();
      user.refreshTokens.push(hashedToken);
    } else {
      user.singleSessionToken = hashedToken;
    }

    await this.findByIdAndUpdate(user_id, {
      refreshTokens: user.refreshTokens,
      singleSessionToken: user.singleSessionToken,
    });

    return;
  }

  /** validatePassword
   * Checks if a user/password pair is valid
   *
   * @returns A boolean indicating validity
   */
  public async validatePassword(user_id: string, password: string): Promise<boolean> {
    const user = await this.findById(user_id);
    if (!user) return false;

    // Validates password
    return bcrypt.compare(password, user.password);
  }

  /** validatePassword
   * Checks if a user/refreshtoken pair is valid
   *
   * @returns A boolean indicating validity
   */
  public async validateRefreshToken(user_id: string, token: string): Promise<UserModel | null> {
    const user = await this.findById(user_id);
    if (!user) return null;

    let valid = bcrypt.compareSync(token, user.singleSessionToken);

    for (let i = 0; i < user.refreshTokens.length; i++) {
      if (bcrypt.compareSync(token, user.refreshTokens[i])) {
        valid = true;
        break;
      }
    }

    return valid ? this.ConvertUserDocToUser(user) : null;
  }

  // ---------------------------------------------
  async getAll(): Promise<UserDocument[]> {
    return this.find({});
  }
}

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
import { BaseSchema, BaseRepository } from '@towech-finance/shared/feature/mongo';
// Models
import { UserModel, UserRoles } from '@towech-finance/shared/utils/models';

// TODO: Set conditions
@Schema({ versionKey: false, collection: 'users' })
export class UserDocument extends BaseSchema {
  @Prop({ type: String, required: true })
  public name: string;

  @Prop({ type: String, required: true })
  public mail: string;

  @Prop({ type: String, required: true })
  public password: string;

  @Prop({ type: String, required: true })
  public role: UserRoles;

  @Prop({ type: Boolean, default: false })
  public accountConfirmed: boolean;

  @Prop({ type: Array, default: [] })
  public refreshTokens: string[];

  @Prop({ type: String, required: false })
  public singleSessionToken?: string;

  @Prop({ type: String, required: false })
  public resetToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

@Injectable()
export class AuthenticationUserService extends BaseRepository<UserDocument> {
  private REFRESH_TOKEN_MAX_COUNT = 5;

  public constructor(@InjectModel(UserDocument.name) public readonly model: Model<UserDocument>) {
    super(model);
  }

  /**
   * Converts the databse user into the user Model that is used app wide
   * @param {UserDocument} input - The user document
   * @returns {UserModel} The user in Model format
   */
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

  /**
   * Fetches a user by matching the email
   * @param {string} mail - The user document
   * @returns {UserModel | null} The retrieved user, null if not found
   */
  public async getByEmail(mail: string): Promise<UserModel | null> {
    const user = await this.findOne({ mail });

    return this.ConvertUserDocToUser(user);
  }

  /**
   * Fetches a user by matching the id
   * @param {ObjectId | string} id - The user id
   * @returns {UserModel | null} The retrieved user, null if not found
   */
  public async getById(id: Types.ObjectId | string): Promise<UserModel | null> {
    return this.ConvertUserDocToUser(await super.findById(id));
  }

  /**
   * Registers a new user to the database
   * @param {string} name
   * @param {string} password - The plaintext password, this function hashes it
   * @param {string} mail
   * @param {UserRoles} role - Defaults to USER
   * @returns {UserModel} The new user
   */
  public async register(
    name: string,
    password: string,
    mail: string,
    role: UserRoles = UserRoles.USER
  ): Promise<UserModel> {
    const userExists = await this.findOne({ mail });
    if (userExists !== null) throw new Error('validation.REGISTERED_MAIL');

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

  /**
   * Clears the tokens from a user
   * @param {string} id - Id of the user
   * @param {string | null} token - Token that will be removed, if null all tokens are removed
   */
  public async removeRefreshToken(id: string, token: string | null): Promise<void> {
    const user = await super.findById(id);
    if (!user) return;

    const refreshTokens = !token
      ? []
      : user.refreshTokens.filter(x => !bcrypt.compareSync(token, x));
    const singleSessionToken =
      !token || bcrypt.compareSync(token, user.singleSessionToken)
        ? undefined
        : user.singleSessionToken;

    this.findByIdAndUpdate(id, {
      refreshTokens,
      singleSessionToken,
    });
  }

  /**
   * Adds a refresh token to the user, the token is hashed inside the database
   * @param {string} id - Id of the user
   * @param {string} token - Token that will be added
   * @param keepSession - Flag that indicates if the token is a singleSessionToken or a regular token
   */
  public async storeRefreshToken(id: string, token: string, keepSession = false): Promise<void> {
    const user = await this.findById(id);
    if (!user) return;

    const hashedToken = bcrypt.hashSync(token, bcrypt.genSaltSync());

    if (keepSession) {
      if (user.refreshTokens.length >= this.REFRESH_TOKEN_MAX_COUNT) user.refreshTokens.shift();
      user.refreshTokens.push(hashedToken);
    } else {
      user.singleSessionToken = hashedToken;
    }

    await this.findByIdAndUpdate(id, {
      refreshTokens: user.refreshTokens,
      singleSessionToken: user.singleSessionToken,
    });

    return;
  }

  /**
   * Checks if a user/password pair is valid
   * @param {string} id - Id if the user
   * @param {string} password - Plaintext password of the user
   * @returns A boolean indicating validity
   */
  public async validatePassword(id: string, password: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;

    // Validates password
    return bcrypt.compare(password, user.password);
  }

  /**
   * Checks if a user/refreshtoken pair is valid
   * @param {string} id - Id if the user
   * @param {string} token - Refresh token
   * @returns A boolean indicating validity
   */
  public async validateRefreshToken(id: string, token: string): Promise<UserModel | null> {
    const user = await this.findById(id);
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
  public async getAll(): Promise<UserDocument[]> {
    return this.find({});
  }
}

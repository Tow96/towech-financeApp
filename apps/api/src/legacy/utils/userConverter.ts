/** userConverter.ts
 * Copyright (c) 2022, Toweclabs
 * All rights reserved.
 *
 * Class that converts the user object to more private versions this ensures that no other properties are divulged
 * by just printing a variable
 */

import { Objects } from '../Models';

export default class UserConverter {
  static convertToFrontendUser(user: Objects.User.BackendUser): Objects.User.FrontendUser {
    const output: Objects.User.FrontendUser = {
      _id: user._id,
      accountConfirmed: user.accountConfirmed,
      createdAt: user.createdAt,
      name: user.name,
      refreshTokens: user.refreshTokens,
      resetToken: user.resetToken,
      role: user.role,
      singleSessionToken: user.singleSessionToken,
      username: user.username,
    };

    return output;
  }

  static convertToBaseUser(user: Objects.User.FrontendUser): Objects.User.BaseUser {
    const output: Objects.User.BaseUser = {
      _id: user._id,
      accountConfirmed: user.accountConfirmed,
      createdAt: user.createdAt,
      name: user.name,
      role: user.role,
      username: user.username,
    };

    return output;
  }
}

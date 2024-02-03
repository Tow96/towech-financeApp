import { Login } from '@/libs/feature-authentication/UserService';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import TokenGenerator from '../TokenGenerator';

/* eslint-disable max-depth */
const generateError = (status = 500, message = 'Unexpected Error', error?: any) => ({
  status,
  message,
  error,
});

class Validator {
  // static validateEmail = async (email: string): Promise<{ valid: boolean; errors: any }> => {
  //   const errors: any = {};

  //   // Checks if email is not empty and is valid
  //   if (!email || email.trim() === '') {
  //     errors.email = 'e-mail must not be empty';
  //   } else {
  //     const regEx = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}$/;
  //     if (!email.match(regEx)) {
  //       errors.email = 'e-mail must be a valid address';
  //     }
  //   }

  //   // Checks the DB to see if the user already exists
  //   if (await User.getByEmail(email)) errors.email = 'e-mail already registered';

  //   return {
  //     errors,
  //     valid: Object.keys(errors).length < 1,
  //   };
  // };

  static validateName = async (name: string): Promise<{ valid: boolean; errors: any }> => {
    const errors: any = {};

    // Checks if name is not empty
    if (name.trim() === '') {
      errors.name = 'name must not be empty';
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
  };
}

export const login = async (cred: Login) => {
  try {
    const user = await prisma.users.findFirst({ where: { username: cred.username } });
    if (!user) throw generateError(422, 'Bad credentials', { login: 'Bad credentials' });

    const validPassword = await bcrypt.compare(cred.password, user.password);
    if (!validPassword) throw generateError(422, 'Bad credentials', { login: 'Bad credentials' });

    const authToken = TokenGenerator.authToken(user);
    const refreshToken = TokenGenerator.refreshToken(user, cred.keepSession);

    let refreshTokens = [...user.refreshTokens];
    let singleSessionToken = `${user.singleSessionToken}`;
    if (cred.keepSession) {
      // Creates an empty array if there are no tokens
      if (!user.refreshTokens) refreshTokens = [];

      // removes the last used refreshToken if there are more than 5
      if (refreshTokens.length >= 5) refreshTokens.shift();

      // Adds the new refresh token
      refreshTokens.push(refreshToken);
    } else {
      singleSessionToken = refreshToken;
    }

    // Query the DB, doesn't wait for response
    await prisma.users.update({
      where: { id: user.id },
      data: { singleSessionToken, refreshTokens },
    });
    return { authToken, refreshToken };
  } catch (error) {
    throw generateError(500, 'Unexpected Error', error);
  }
};

export const logout = async (id: string, token: string | null = null) => {
  try {
    const user = await prisma.users.findFirst({ where: { id } });
    if (!user) throw generateError(422, 'Bad credentials', { login: 'Bad credentials' });

    if (token) {
      // Removes the token from the user
      if (user.singleSessionToken === token) user.singleSessionToken = '';
      if (user.refreshTokens)
        user.refreshTokens = user.refreshTokens.filter(rToken => rToken !== token);
    } else {
      user.refreshTokens = [];
      user.singleSessionToken = '';
    }

    await prisma.users.update({
      where: { id },
      data: { singleSessionToken: user.singleSessionToken, refreshTokens: user.refreshTokens },
    });
  } catch (error) {
    throw generateError(500, 'Unexpected Error', error);
  }
};

export const verifyEmail = async (id: string) => {
  const user = await prisma.users.findFirst({ where: { id } });
  if (!user) throw generateError(404, 'User not found');

  if (!user.accountConfirmed)
    await prisma.users.update({ where: { id }, data: { accountConfirmed: true } });
};

export const editUser = async (id: string, changes: any) => {
  try {
    let errors: any = {};
    const content: any = {};

    // Validation
    if (changes.name) {
      const nameValidation = await Validator.validateName(changes.name);
      if (!nameValidation.valid) errors = { ...errors, ...nameValidation.errors };
      else {
        const dbuser = await prisma.users.findFirst({ where: { id } });
        if (!dbuser) errors.user = `Invalid user`;
        else if (dbuser.name !== changes.name.trim()) {
          content.name = changes.name.trim();
        }
      }
    }

    // If there is an error, it gets thrown
    if (Object.keys(errors).length > 0) return generateError(422, 'Invalid fields', errors);

    // If there aren't any changes, returns a 304 code
    if (Object.keys(content).length < 1) return { status: 304 };

    // Updates the transaction
    const updatedUser = await prisma.users.update({ where: { id }, data: content });
    const output = {
      _id: updatedUser.id,
      accountConfirmed: updatedUser.accountConfirmed,
      createdAt: updatedUser.createdAt,
      name: updatedUser.name,
      role: updatedUser.role,
      username: updatedUser.username,
    };

    return { ...output, status: 201 };
  } catch (e) {
    return e;
  }
};

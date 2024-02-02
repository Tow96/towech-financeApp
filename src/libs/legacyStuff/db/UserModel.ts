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

/** Model.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Class that handles the Database Authentication Model
 */
// Libraries ------------------------------------------------------------------
import { Cookie } from 'lucia';
import { lucia } from './Auth';
import { UsersDb } from './DataAccessDb';
import { DbError } from '@/utils';
// Schemas --------------------------------------------------------------------
import { AuthError, InsertUser, Login, User } from './Schema';

export class UsersModel {
  private db = new UsersDb();

  register = async (user: InsertUser, password: string) => {
    const userExists = await this.db.getByEmail(user.email); // eslint-disable-line
    if (userExists) throw new DbError(`email ${user.email} already registered`);

    return await this.db.add(user, password);
  };

  login = async (credentials: Login): Promise<{ cookie: Cookie; user: User }> => {
    const userExists = await this.db.getByEmail(credentials.email); // eslint-disable-line
    if (!userExists) throw new AuthError('Invalid credentials');

    const validPassword = await this.db.verifyPassword(userExists.id, credentials.password);
    if (!validPassword) throw new AuthError('Invalid credentials');

    const session = await lucia.createSession(userExists.id, {});
    return { cookie: lucia.createSessionCookie(session.id), user: userExists };
  };

  logout = async (id: string, userid?: string): Promise<Cookie> => {
    if (userid) lucia.invalidateUserSessions(userid);
    else lucia.invalidateSession(id);

    const emptyCookie = lucia.createBlankSessionCookie();
    return emptyCookie;
  };
}

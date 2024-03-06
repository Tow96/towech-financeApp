/** Model.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Class that handles the Database Authentication Model
 */
// Libraries ------------------------------------------------------------------
import { DbError } from '../data-access/db';
import { UsersDb } from './DataAccessDb';
// Schemas --------------------------------------------------------------------
import { InsertUser } from './Schema';

export class UsersModel {
  private db = new UsersDb();

  register = async (user: InsertUser, password: string) => {
    const userExists = await this.db.getByEmail(user.email); // eslint-disable-line
    if (userExists) throw new DbError(`email ${user.email} already registered`);

    return await this.db.add(user, password);
  };
}

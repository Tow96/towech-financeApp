import { UserRoles } from './roles.enum';

export class UserModel {
  _id: string;
  name: string;
  mail: string;
  role: UserRoles;
  accountConfirmed: boolean;

  constructor(id: string, name: string, mail: string, role: UserRoles, accountConfirmed: boolean) {
    this._id = id;
    this.accountConfirmed = accountConfirmed;
    this.mail = mail;
    this.name = name;
    this.role = role;
  }
}

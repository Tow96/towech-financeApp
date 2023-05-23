import { UserRoles } from './roles.enum';

export class UserModel {
  public _id: string;
  public name: string;
  public mail: string;
  public role: UserRoles;
  public accountConfirmed: boolean;

  public constructor(
    id: string,
    name: string,
    mail: string,
    role: UserRoles,
    accountConfirmed: boolean
  ) {
    this._id = id;
    this.accountConfirmed = accountConfirmed;
    this.mail = mail;
    this.name = name;
    this.role = role;
  }
}

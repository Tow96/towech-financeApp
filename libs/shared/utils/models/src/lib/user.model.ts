import { UserRoles } from './roles.enum';

export class UserModel {
  name: string;
  mail: string;
  role: UserRoles;
  accountConfirmed: boolean;

  constructor(name: string, mail: string, role: UserRoles, accountConfirmed: boolean) {
    this.accountConfirmed = accountConfirmed;
    this.mail = mail;
    this.name = name;
    this.role = role;
  }
}

import { UserRoles } from './roles.enum';

export interface UserModel {
  name: string;
  mail: string;
  role: UserRoles;
  accountConfirmed: boolean;
}

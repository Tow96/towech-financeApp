// TODO: Add roles enumerator

import { UserRoles } from './roles.enum';

export interface CreateUser {
  name: string;
  mail: string;
  role: UserRoles;
}

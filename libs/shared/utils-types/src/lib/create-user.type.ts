import { UserRoles } from './roles.enum';

export type CreateUser = {
  name: string;
  mail: string;
  role: UserRoles;
};

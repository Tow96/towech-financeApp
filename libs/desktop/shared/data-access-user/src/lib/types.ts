import { UserModel } from '@finance/shared/utils-types';

export enum Status {
  INIT = 'initialized',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface DecodedUser extends UserModel {
  iat: number;
  exp: number;
}

export type UserResponse = {
  user: DecodedUser;
  token: string;
};

export interface State {
  data: DecodedUser | null;
  status: Status;
  token: string | null;
}

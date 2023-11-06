import { UserModel } from './user.type';

export class RefreshToken {
  id: string;
  user: UserModel;

  constructor(id: string, user: UserModel) {
    this.id = id;
    this.user = user;
  }
}

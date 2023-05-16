import { UserModel } from './user.model';

export class RefreshToken {
  id: string;
  user: UserModel;

  constructor(id: string, user: UserModel) {
    this.id = id;
    this.user = user;
  }
}

import { UserModel } from './user.model';

export class RefreshToken {
  public id: string;
  public user: UserModel;

  public constructor(id: string, user: UserModel) {
    this.id = id;
    this.user = user;
  }
}

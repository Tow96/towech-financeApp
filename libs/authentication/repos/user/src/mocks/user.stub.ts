import { Types } from 'mongoose';
import { UserDocument } from '../lib/authentication-user.service';
import { UserRoles } from '@towech-finance/shared/utils/models';

export const passwordStub = (): string => 'testpass';
export const refreshArrStub = (): string => 'token';

export const userStub = (): UserDocument => ({
  _id: new Types.ObjectId('63ef9ebca2b48f1fe74b010a'),
  accountConfirmed: true,
  createdAt: new Date(0, 0, 0),
  mail: 'fake@mail.com',
  name: 'Fakeman',
  password: '$2a$12$JxPo81IP7gIwdReGNCYNEOFi5usufyYbnWKHuZpiBkRdOZEx6XUoW',
  refreshTokens: ['$2a$12$/ARloS5YIBlbrtuHXjLTs.ytHzBk/2mvAOJhkPK/9fKVC6c/wvaUu'],
  singleSessionToken: '$2a$12$uN60DdNH1CxQVdFXfG5Zn.ddqo.hlp9RB7BRIJ2S30O3b/0W6v/EC',
  role: UserRoles.USER,
});

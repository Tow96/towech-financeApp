import { Types } from 'mongoose';
import { UserDocument } from '../lib/authentication-user.service';
import { UserModel, UserRoles } from '@towech-finance/shared/utils/models';

export const passwordStub = (): string => 'testpass';
export const refreshArrStub = (): string => 'token';
export const singleTokenStub = (): string => 'singleTest';

export const userStub = (): UserDocument => ({
  _id: new Types.ObjectId('63ef9ebca2b48f1fe74b010a'),
  accountConfirmed: true,
  createdAt: new Date(0, 0, 0),
  mail: 'fake@mail.com',
  name: 'Fakeman',
  password: '$2a$12$JxPo81IP7gIwdReGNCYNEOFi5usufyYbnWKHuZpiBkRdOZEx6XUoW',
  refreshTokens: ['$2a$12$/ARloS5YIBlbrtuHXjLTs.ytHzBk/2mvAOJhkPK/9fKVC6c/wvaUu'],
  singleSessionToken: '$2a$12$AoktqIf/Ujus4k2AOhk7De5mNZ8pUXw/x8zTpVvulDmyTMj7j9Uqm',
  role: UserRoles.USER,
});

export const adminStub = (): UserDocument => ({
  _id: new Types.ObjectId('63ef9ebca2b48f1fe74b010b'),
  accountConfirmed: true,
  createdAt: new Date(0, 0, 0),
  mail: 'fake@mail.com',
  name: 'Fakeman',
  password: '$2a$12$JxPo81IP7gIwdReGNCYNEOFi5usufyYbnWKHuZpiBkRdOZEx6XUoW',
  refreshTokens: ['$2a$12$/ARloS5YIBlbrtuHXjLTs.ytHzBk/2mvAOJhkPK/9fKVC6c/wvaUu'],
  singleSessionToken: '$2a$12$AoktqIf/Ujus4k2AOhk7De5mNZ8pUXw/x8zTpVvulDmyTMj7j9Uqm',
  role: UserRoles.ADMIN,
});

export const plainUserStub = (): UserModel => {
  return {
    _id: userStub()._id.toString(),
    accountConfirmed: userStub().accountConfirmed,
    mail: userStub().mail,
    name: userStub().name,
    role: userStub().role,
  };
};

export const plainAdminStub = (): UserModel => {
  return {
    _id: adminStub()._id.toString(),
    accountConfirmed: adminStub().accountConfirmed,
    mail: adminStub().mail,
    name: adminStub().name,
    role: adminStub().role,
  };
};

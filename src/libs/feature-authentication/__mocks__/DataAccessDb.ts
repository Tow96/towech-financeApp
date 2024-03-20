import { InsertUser, User } from '../Schema';

export const stubOwner: User = {
  accountConfirmed: true,
  createdAt: new Date(),
  email: 'owner@mail.com',
  id: '1234',
  name: 'owner',
  role: 'owner',
  updatedAt: new Date(),
};
export const stubUser: User = {
  accountConfirmed: true,
  createdAt: new Date(),
  email: 'owner@mail.com',
  id: '4321',
  name: 'user',
  role: 'user',
  updatedAt: new Date(),
};

export const stubPass = 'validPassword';

const data: User[] = [stubOwner, stubUser];
export const MockUsersDb = {
  getByEmail: (email: string) => data.find(i => i.email === email) || null,
  add: (user: InsertUser): User => ({
    role: 'user',
    ...user,
    accountConfirmed: false,
    createdAt: new Date(),
    id: '32425',
    updatedAt: new Date(),
  }),
  verifyPassword: (id: string, pass: string) => id === stubOwner.id && pass === stubPass,
};

import { InsertUser, User } from '../Schema';

export const stubOwner: User = {
  accountConfirmed: true,
  createdAt: new Date(),
  deleted: false,
  email: 'owner@mail.com',
  id: '1234',
  name: 'owner',
  role: 'owner',
  updatedAt: new Date(),
};

const data: User[] = [stubOwner];
export const MockUsersDb = {
  getByEmail: (email: string) => data.find(i => i.email === email) || null,
  add: (user: InsertUser): User => ({
    role: 'user',
    ...user,
    accountConfirmed: false,
    createdAt: new Date(),
    deleted: false,
    id: '32425',
    updatedAt: new Date(),
  }),
};

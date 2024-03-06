// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { DbError } from '@/libs/data-access/db';
import { UsersModel } from '../../Model';
import { InsertUser } from '../../Schema';
// Mocks ----------------------------------------------------------------------
import { MockUsersDb, stubOwner } from '../../__mocks__/DataAccessDb';
jest.mock('../../DataAccessDb', () => ({
  UsersDb: jest.fn().mockImplementation(() => MockUsersDb),
}));

describe('UsersModel.register', () => {
  const model = new UsersModel();

  describe('Given an email that is already registered', () => {
    const insertUser: InsertUser = { email: stubOwner.email, name: 'othername', role: 'user' };
    test('- Then it should throw a db error', () => {
      const t = async () => model.register(insertUser, 'something');

      expect(t).rejects.toThrow(new DbError('email owner@mail.com already registered'));
    });
  });

  describe('Given a new user', () => {
    const insertUser: InsertUser = { email: 'new@mail.com', name: 'newUser', role: 'owner' };
    test('- Then it should return the newly created user', async () => {
      const newUser = await model.register(insertUser, 'something');
      expect(newUser).toEqual({
        ...insertUser,
        accountConfirmed: false,
        createdAt: expect.any(Date),
        deleted: false,
        id: expect.any(String),
        updatedAt: expect.any(Date),
      });
    });
  });
});

// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { DbError } from '@/utils/db';
import { UsersModel } from '../../Model';
import { AuthError, InsertUser, Login } from '../../Schema';
// Mocks ----------------------------------------------------------------------
import { stubOwner, stubPass } from '../../__mocks__/DataAccessDb';

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

describe('UsersModel.login', () => {
  const model = new UsersModel();

  describe('Given an unexistent email', () => {
    const login: Login = { email: 'notreal', password: 'wrong', keepSession: false };
    test('- Then it should throw an unauthorized error', () => {
      const t = async () => model.login(login);

      expect(t).rejects.toThrow(new AuthError('Invalid credentials'));
    });
  });

  describe('Given an incorrect password', () => {
    const login: Login = { email: stubOwner.email, password: 'wrong', keepSession: false };
    test('- Then it should throw an unauthorized error', () => {
      const t = async () => model.login(login);

      expect(t).rejects.toThrow(new AuthError('Invalid credentials'));
    });
  });

  describe('Given valid credentials', () => {
    const login: Login = { email: stubOwner.email, password: stubPass, keepSession: false };
    test('-Then it should return the generated cookie', async () => {
      const data = await model.login(login);
      expect(data.cookie.value).toBe('sessionid');
    });
  });
});

describe('UsersModel.logout', () => {
  const model = new UsersModel();
  test('Given a session id and a userid', async () => {
    const data = await model.logout('session', 'user');
    expect(data.value).toBe('');
    expect(data.attributes.maxAge).toBe(0);
  });
});

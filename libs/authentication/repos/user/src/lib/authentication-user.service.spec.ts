import { Test } from '@nestjs/testing';
import { MockModel } from '@towech-finance/shared/features/mongo';
import { UserDocument } from './authentication-user.service';
import { Types } from 'mongoose';
import { AuthenticationUserService } from './authentication-user.service';
import { getModelToken } from '@nestjs/mongoose';
import { describe } from 'node:test';
import { UserRoles, UserModel } from '@towech-finance/shared/utils/models';

const userStub = (): UserDocument => ({
  _id: new Types.ObjectId('63ef9ebca2b48f1fe74b010a'),
  accountConfirmed: true,
  createdAt: new Date(0, 0, 0),
  mail: 'fake@mail.com',
  name: 'Fakeman',
  password: 'THISISVERYENCRYPTED',
  refreshToken: [],
  role: UserRoles.USER,
});

class MockUserModel extends MockModel<UserDocument> {
  protected entityStub = userStub();
}

const validateUserType = (response: any) => {
  expect(response).toBeInstanceOf(UserModel);
  expect(response.password).toBeUndefined();
  expect(response.refreshToken).toBeUndefined();
  expect(response.singleSessionToken).toBeUndefined();
};

let userRepo: AuthenticationUserService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      AuthenticationUserService,
      { provide: getModelToken(UserDocument.name), useClass: MockUserModel },
    ],
  }).compile();
  userRepo = moduleRef.get<AuthenticationUserService>(AuthenticationUserService);
});

describe('register', () => {
  describe('When register is called for a user that already exists', () => {
    it('Should throw an error', async () => {
      await expect(
        userRepo.register(userStub().name, userStub().password, userStub().mail)
      ).rejects.toThrow();
    });
  });

  describe('When register is called without a role', () => {
    let response: any;
    beforeAll(async () => {
      jest.clearAllMocks();
      response = await userRepo.register(
        userStub().name,
        userStub().password,
        'anotheraddress@mail.com'
      );
    });

    it('Should return a generic type user', () => validateUserType(response));
  });
});

describe('getByEmail', () => {
  describe('When it is called with an unregistered mail', () => {
    let response: any;
    beforeEach(async () => {
      jest.clearAllMocks();
      response = await userRepo.getByEmail('another@mail.com');
    });

    it('Should return null', () => {
      expect(response).toBe(null);
    });
  });

  describe('When it is called with a registered mail', () => {
    let response: any;
    beforeEach(async () => {
      jest.clearAllMocks();
      response = await userRepo.getByEmail(userStub().mail);
    });

    it('Should return the requested user', () => {
      expect(response.mail).toEqual(userStub().mail);
    });

    it('Should return a generic user', () => validateUserType(response));
  });
});

describe('When getAll is called', () => {
  let responseUsers: UserDocument[];
  beforeEach(async () => {
    jest.clearAllMocks();
    responseUsers = await userRepo.getAll();
  });
  it('Should return an array', () => {
    expect(responseUsers).toEqual([userStub()]);
  });
});

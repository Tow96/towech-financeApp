import { Test } from '@nestjs/testing';
import { MockModel } from '@towech-finance/shared/features/mongo';
import { UserDocument } from './authentication-user.service';
import { Types } from 'mongoose';
import { AuthenticationUserService } from './authentication-user.service';
import { getModelToken } from '@nestjs/mongoose';
import { describe } from 'node:test';
import { UserRoles } from '@towech-finance/shared/utils/models';

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

let userRepoValue: AuthenticationUserService;
let userRepoClass: AuthenticationUserService;
let responseUser: UserDocument;

describe('"useValue" functions', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticationUserService,
        { provide: getModelToken(UserDocument.name), useValue: MockUserModel },
      ],
    }).compile();
    userRepoValue = moduleRef.get<AuthenticationUserService>(AuthenticationUserService);
  });

  describe('When register is called without a role', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      responseUser = await userRepoValue.register(
        userStub().name,
        userStub().password,
        userStub().mail
      );
    });

    it('Should return the new user', () => {
      expect(responseUser).toEqual({ ...userStub(), role: 'user' });
    });
  });
});

describe('"useClass" functions', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticationUserService,
        { provide: getModelToken(UserDocument.name), useClass: MockUserModel },
      ],
    }).compile();
    userRepoClass = moduleRef.get<AuthenticationUserService>(AuthenticationUserService);
  });

  describe('When getAll is called', () => {
    let responseUsers: UserDocument[];
    beforeEach(async () => {
      jest.clearAllMocks();
      responseUsers = await userRepoClass.getAll();
    });
    it('Should return an array', () => {
      expect(responseUsers).toEqual([userStub()]);
    });
  });
});

import { Test } from '@nestjs/testing';
import { MockModel } from '@towech-finance/shared/features/mongo';
import { UserDocument } from './authentication-user.service';
import { AuthenticationUserService } from './authentication-user.service';
import { getModelToken } from '@nestjs/mongoose';
import { describe } from 'node:test';
import { UserModel } from '@towech-finance/shared/utils/models';
import { userStub, passwordStub, refreshArrStub } from '../mocks/user.stub';

class MockUserModel extends MockModel<UserDocument> {
  protected entityStub = userStub();
}

const validateUserType = (response: any) => {
  expect(response).toBeInstanceOf(UserModel);
  expect(response.password).toBeUndefined();
  expect(response.refreshTokens).toBeUndefined();
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

describe('validatePassword', () => {
  describe('when it is called for an invalid user', () => {
    let response: any;
    beforeAll(async () => {
      response = await userRepo.validatePassword('false', 'fake');
    });

    it('Should return false', () => {
      expect(response).toBe(false);
    });
  });

  describe('when it is called with an invalid password', () => {
    let response: any;
    beforeAll(async () => {
      response = await userRepo.validatePassword(userStub()._id.toString(), 'fake');
    });

    it('Should return false', () => {
      expect(response).toBe(false);
    });
  });

  describe('when it is called with a valid user/password', () => {
    let response: any;
    beforeAll(async () => {
      response = await userRepo.validatePassword(userStub()._id.toString(), passwordStub());
    });

    it('Should return true', () => {
      expect(response).toBe(true);
    });
  });
});

describe('validateRefreshToken', () => {
  describe('when it is called for an invalid user', () => {
    let response: any;
    beforeAll(async () => {
      response = await userRepo.validateRefreshToken('false', 'fake');
    });

    it('Should return false', () => {
      expect(response).toBe(false);
    });
  });

  describe('when it is called with an invalid token', () => {
    let response: any;
    beforeAll(async () => {
      response = await userRepo.validateRefreshToken(userStub()._id.toString(), 'fake');
    });

    it('Should return false', () => {
      expect(response).toBe(false);
    });
  });

  describe('when it is called with a valid user/token', () => {
    let response: any;
    beforeAll(async () => {
      response = await userRepo.validateRefreshToken(userStub()._id.toString(), refreshArrStub());
    });

    it('Should return true', () => {
      expect(response).toBe(true);
    });
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

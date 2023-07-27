// Libraries
import { Test } from '@nestjs/testing';
// import { getModelToken } from '@nestjs/mongoose';
// Tested elements
import { UserDocument } from './authentication-user.service';
// Mocks
// import { MockModel } from '@towech-finance/shared/feature/mongo';
import { userStub, passwordStub, refreshArrStub, singleTokenStub } from '../mocks/user.stub';
// Services
import { AuthenticationUserService } from './authentication-user.service';
// Models
import { UserModel } from '@towech-finance/shared/utils/models';

// class MockUserModel extends MockModel<UserDocument> {
//   protected entityStub = userStub();
// }

const validateUserType = (response: any) => {
  expect(response).toBeInstanceOf(UserModel);
  expect(response.password).toBeUndefined();
  expect(response.refreshTokens).toBeUndefined();
  expect(response.singleSessionToken).toBeUndefined();
};

describe.skip('User Repo', () => {
  let userRepo: AuthenticationUserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticationUserService,
        // { provide: getModelToken(UserDocument.name), useClass: MockUserModel },
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

  describe('getById', () => {
    describe('When it is called with an unregistered id', () => {
      let response: any;
      beforeEach(async () => {
        jest.clearAllMocks();
        response = await userRepo.getById('');
      });

      it('Should return null', () => {
        expect(response).toBe(null);
      });
    });

    describe('When it is called with a registered id', () => {
      let response: any;
      beforeEach(async () => {
        jest.clearAllMocks();
        response = await userRepo.getById(userStub()._id);
      });

      it('Should return the requested user', () => {
        expect(response._id.toString()).toEqual(userStub()._id.toString());
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

      it('Should return null', () => {
        expect(response).toBe(null);
      });
    });

    describe('when it is called with an invalid token', () => {
      let response: any;
      beforeAll(async () => {
        response = await userRepo.validateRefreshToken(userStub()._id.toString(), 'fake');
      });

      it('Should return null', () => {
        expect(response).toBe(null);
      });
    });

    describe('when it is called with a valid user/token', () => {
      let response: any;
      beforeAll(async () => {
        response = await userRepo.validateRefreshToken(userStub()._id.toString(), refreshArrStub());
      });

      it('Should return the user', () => {
        expect(response).toBeInstanceOf(UserModel);
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

  describe('When removeRefreshToken is called for an inexistent user', () => {
    it('Should not do nothing and return', async () => {
      const spy = jest.spyOn(userRepo.model, 'findByIdAndUpdate');
      await userRepo.removeRefreshToken('invalid', 'token');

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('When removeRefreshToken is called without any token', () => {
    it('Should call the model and remove only the refreshtoken', async () => {
      jest.clearAllMocks();
      const spy = jest.spyOn(userRepo.model, 'findByIdAndUpdate');
      await userRepo.removeRefreshToken(userStub()._id.toString(), null);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        userStub()._id.toString(),
        {
          refreshTokens: [],
          singleSessionToken: undefined,
        },
        { lean: true, new: true, upsert: true }
      );
    });
  });

  describe('When removeRefreshToken is called for a kept session token', () => {
    it('Should call the model and remove only the refreshtoken', async () => {
      jest.clearAllMocks();
      const spy = jest.spyOn(userRepo.model, 'findByIdAndUpdate');
      await userRepo.removeRefreshToken(userStub()._id.toString(), refreshArrStub());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        userStub()._id.toString(),
        {
          refreshTokens: [],
          singleSessionToken: userStub().singleSessionToken,
        },
        { lean: true, new: true, upsert: true }
      );
    });
  });

  describe('When removeRefreshToken is called for a single session token', () => {
    it('Should call the model and remove only the single session token', async () => {
      jest.clearAllMocks();
      const spy = jest.spyOn(userRepo.model, 'findByIdAndUpdate');
      await userRepo.removeRefreshToken(userStub()._id.toString(), singleTokenStub());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        userStub()._id.toString(),
        {
          refreshTokens: userStub().refreshTokens,
          singleSessionToken: undefined,
        },
        { lean: true, new: true, upsert: true }
      );
    });
  });

  describe('When storeRefreshToken is called for an inexistent user', () => {
    it('Should not do nothing and return', async () => {
      jest.clearAllMocks();
      const spy = jest.spyOn(userRepo.model, 'findByIdAndUpdate');
      await userRepo.storeRefreshToken('invalid', 'token');

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('When storeRefreshToken is called with keep session', () => {
    it('Should call the model and add the refreshtoken', async () => {
      jest.clearAllMocks();
      const spy = jest.spyOn(userRepo.model, 'findByIdAndUpdate');
      await userRepo.storeRefreshToken(userStub()._id.toString(), 'newToken', true);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        userStub()._id.toString(),
        {
          refreshTokens: [...userStub().refreshTokens, expect.any(String)],
          singleSessionToken: userStub().singleSessionToken,
        },
        { lean: true, new: true, upsert: true }
      );
    });
  });

  describe('When storeRefreshToken is called without keep session', () => {
    it('Should call the model and add the refreshtoken', async () => {
      jest.clearAllMocks();
      const spy = jest.spyOn(userRepo.model, 'findByIdAndUpdate');
      await userRepo.storeRefreshToken(userStub()._id.toString(), 'newToken');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        userStub()._id.toString(),
        {
          refreshTokens: userStub().refreshTokens,
          singleSessionToken: expect.any(String),
        },
        { lean: true, new: true, upsert: true }
      );
    });
  });
});

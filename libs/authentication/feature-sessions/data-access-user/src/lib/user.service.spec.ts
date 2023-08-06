// Libraries
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
// Tested elements
import { UserDocument } from './utils/user.schema';
import { AuthenticationFeatureSessionsDataAccessUserService } from './user.service';
// Models
import { UserModel } from '@finance/shared/utils-types';
// Mocks
import {
  MockModel,
  passwordStub,
  plainUserStub,
  refreshArrStub,
  singleTokenStub,
  userStub,
} from '@finance/authentication/shared/utils-testing';

class MockUserModel extends MockModel<UserDocument> {
  protected entityStub = userStub() as UserDocument;
}
// ----------------------------------------------------------------------------
describe('User Service', () => {
  let service: AuthenticationFeatureSessionsDataAccessUserService;
  let response: any;
  let spy: jest.SpyInstance<any>;

  const validateUserType = (response: any) => {
    expect(response).toBeInstanceOf(UserModel);
    expect(response.password).toBeUndefined();
    expect(response.refreshTokens).toBeUndefined();
    expect(response.singleSessionToken).toBeUndefined();
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticationFeatureSessionsDataAccessUserService,
        { provide: getModelToken(UserDocument.name), useClass: MockUserModel },
      ],
    }).compile();
    service = moduleRef.get<AuthenticationFeatureSessionsDataAccessUserService>(
      AuthenticationFeatureSessionsDataAccessUserService
    );
  });

  describe('When getAll is called', () => {
    it('Should return an array', async () => {
      response = await service.getAll();
      expect(response).toEqual([plainUserStub()]);
    });
  });

  describe('When getByEmail is called', () => {
    describe('With an unregistered mail', () => {
      it('Should return null', async () => {
        response = await service.getByEmail('another@mail.com');
        expect(response).toBe(null);
      });
    });
    describe('With a registered mail', () => {
      beforeEach(async () => (response = await service.getByEmail(userStub().mail)));

      it('Should return the requested user', () => expect(response.mail).toEqual(userStub().mail));
      it('Should return a generic user', () => validateUserType(response));
    });
  });

  describe('When getById is called', () => {
    describe('With an unregistered id', () => {
      it('Should return null', async () => {
        response = await service.getById('');
        expect(response).toBe(null);
      });
    });
    describe('With a registered id', () => {
      beforeEach(async () => (response = await service.getById(userStub()._id)));

      it('Should return the requested user', () =>
        expect(response._id.toString()).toEqual(userStub()._id.toString()));
      it('Should return a generic user', () => validateUserType(response));
    });
  });

  describe('When register is called', () => {
    describe('For a user that already exists', () => {
      it('Should throw an error', async () =>
        await expect(
          service.register(userStub().name, userStub().password, userStub().mail)
        ).rejects.toThrow());
    });
    describe('Without a role', () => {
      it('Should return a generic type user', async () => {
        response = await service.register(
          userStub().name,
          userStub().password,
          'anotheraddress@mail.com'
        );
        validateUserType(response);
      });
    });
  });

  describe('When removeRefreshToken is called', () => {
    beforeEach(() => (spy = jest.spyOn(service.model, 'findByIdAndUpdate')));

    describe('For an inexistent user', () => {
      it('Should not do nothing and return', async () => {
        await service.removeRefreshToken('invalid', 'token');

        expect(spy).toHaveBeenCalledTimes(0);
      });
    });
    describe('Without any token', () => {
      it('Should call the model and remove only the refreshtoken', async () => {
        await service.removeRefreshToken(userStub()._id.toString(), null);

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
    describe('For a kept session token', () => {
      it('Should call the model and remove only the refreshtoken', async () => {
        await service.removeRefreshToken(userStub()._id.toString(), refreshArrStub());

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
    describe('For a single session token', () => {
      it('Should call the model and remove only the single session token', async () => {
        await service.removeRefreshToken(userStub()._id.toString(), singleTokenStub());

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
  });

  describe('When storeRefreshToken is called', () => {
    beforeEach(() => (spy = jest.spyOn(service.model, 'findByIdAndUpdate')));

    describe('For an inexistent user', () => {
      it('Should not do nothing and return', async () => {
        await service.storeRefreshToken('invalid', 'token');
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });
    describe('With keep session', () => {
      it('Should call the model and add the refreshtoken', async () => {
        await service.storeRefreshToken(userStub()._id.toString(), 'newToken', true);

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
    describe('Without keep session', () => {
      it('Should call the model and add the refreshtoken', async () => {
        await service.storeRefreshToken(userStub()._id.toString(), 'newToken');

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

  describe('When validatePassword is called', () => {
    describe('For an invalid user', () => {
      it('Should return false', async () => {
        response = await service.validatePassword('false', 'fake');
        expect(response).toBe(false);
      });
    });
    describe('With an invalid password', () => {
      it('Should return false', async () => {
        response = await service.validatePassword(userStub()._id.toString(), 'fake');
        expect(response).toBe(false);
      });
    });
    describe('With a valid user/password', () => {
      it('Should return true', async () => {
        response = await service.validatePassword(userStub()._id.toString(), passwordStub());
        expect(response).toBe(true);
      });
    });
  });

  describe('When validateRefreshToken is called', () => {
    describe('For an invalid user', () => {
      it('Should return null', async () => {
        response = await service.validateRefreshToken('false', 'fake');
        expect(response).toBe(null);
      });
    });
    describe('With an invalid token', () => {
      it('Should return null', async () => {
        response = await service.validateRefreshToken(userStub()._id.toString(), 'fake');
        expect(response).toBe(null);
      });
    });
    describe('With a valid user/token', () => {
      it('Should return the user', async () => {
        response = await service.validateRefreshToken(userStub()._id.toString(), refreshArrStub());
        console.log(response);
        expect(response).toBeInstanceOf(UserModel);
      });
    });
  });
});

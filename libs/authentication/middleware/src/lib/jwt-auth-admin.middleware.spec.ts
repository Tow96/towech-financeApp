import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { JwtAuthAdminStrategy } from './jwt-auth-admin.middleware';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { plainAdminStub, plainUserStub } from '@towech-finance/authentication/repos/user';

const OLD_ENV = process.env;
let jwtStrat: JwtAuthAdminStrategy;

beforeAll(async () => {
  process.env.AUTH_TOKEN_SECRET = 'pesto';

  const moduleRef = await Test.createTestingModule({
    providers: [JwtAuthAdminStrategy, AuthUserRepoMock, ConfigService],
  }).compile();

  jwtStrat = moduleRef.get<JwtAuthAdminStrategy>(JwtAuthAdminStrategy);
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('When validate is called', () => {
  describe('with an admin role id', () => {
    let respnse;
    beforeEach(async () => {
      respnse = await jwtStrat.validate(plainAdminStub());
    });

    it('Should return the user', () => {
      expect(respnse).toEqual(plainAdminStub());
    });
  });

  describe('with an user role id', () => {
    it('Should throw an error', async () => {
      await expect(jwtStrat.validate(plainUserStub())).rejects.toThrow();
    });
  });

  describe('with an unregistered id', () => {
    it('Should throw an error', async () => {
      await expect(jwtStrat.validate({ ...plainUserStub(), _id: 'fake' })).rejects.toThrow();
    });
  });
});

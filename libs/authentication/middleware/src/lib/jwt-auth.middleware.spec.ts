import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { JwtAuthStrategy } from './jwt-auth.middleware';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { plainUserStub } from '@towech-finance/authentication/repos/user';

const OLD_ENV = process.env;
let jwtStrat: JwtAuthStrategy;

beforeAll(async () => {
  process.env.AUTH_TOKEN_SECRET = 'pesto';

  const moduleRef = await Test.createTestingModule({
    providers: [JwtAuthStrategy, AuthUserRepoMock, ConfigService],
  }).compile();

  jwtStrat = moduleRef.get<JwtAuthStrategy>(JwtAuthStrategy);
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('When validate is called', () => {
  describe('with an unregistered id', () => {
    it('Should throw an error', async () => {
      await expect(jwtStrat.validate({ ...plainUserStub(), _id: 'fake' })).rejects.toThrow();
    });
  });

  describe('with a valid id', () => {
    let response;
    beforeEach(async () => {
      response = await jwtStrat.validate(plainUserStub());
    });
    it('Should return the user', () => {
      expect(response).toEqual(plainUserStub());
    });
  });
});

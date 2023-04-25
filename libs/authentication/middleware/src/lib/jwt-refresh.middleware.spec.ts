import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { JwtRefreshStrategy } from './jwt-refresh.middleware';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { plainUserStub, userStub } from '@towech-finance/authentication/repos/user';

const OLD_ENV = process.env;
let jwtStrat: JwtRefreshStrategy;

beforeAll(async () => {
  process.env.REFRESH_TOKEN_SECRET = 'pesto';

  const moduleRef = await Test.createTestingModule({
    providers: [JwtRefreshStrategy, AuthUserRepoMock, ConfigService],
  }).compile();

  jwtStrat = moduleRef.get<JwtRefreshStrategy>(JwtRefreshStrategy);
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('When validate is called', () => {
  describe('with an unregistered mail', () => {
    it('Should throw an error', async () => {
      await expect(
        jwtStrat.validate({ id: 'false', user: { ...plainUserStub(), _id: 'fake' } })
      ).rejects.toThrow();
    });
  });

  describe('with an invalid token', () => {
    it('Should throw an error', async () => {
      await expect(
        jwtStrat.validate({ id: 'false', user: { ...plainUserStub() } })
      ).rejects.toThrow();
    });
  });

  describe('with a valid token/user pair', () => {
    let response;
    beforeEach(async () => {
      response = await jwtStrat.validate({
        id: userStub().refreshTokens[0],
        user: plainUserStub(),
      });
    });

    it('Should return the user and the token id', () => {
      expect(response).toEqual({
        id: userStub().refreshTokens[0],
        user: plainUserStub(),
      });
    });
  });
});

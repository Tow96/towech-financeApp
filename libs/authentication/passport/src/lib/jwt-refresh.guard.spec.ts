// Libraries
import { Test } from '@nestjs/testing';
// Tested elements
import { JwtRefreshGuard, JwtRefreshStrategy } from './jwt-refresh.guard';
// Mocks
import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { plainUserStub, userStub } from '@towech-finance/authentication/repos/user';
import { SharedFeaturesI18nJestModule } from '@towech-finance/shared/features/i18n-nest';
// Services
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
// Models
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RefreshToken } from '@towech-finance/shared/utils/models';
import { generateI18nMockExecutionContext } from './utils';

const OLD_ENV = process.env;
let jwtStrat: JwtRefreshStrategy;
let jwtGuard: JwtRefreshGuard;
let i18nService: I18nService;

beforeAll(async () => {
  process.env.REFRESH_TOKEN_SECRET = 'pesto';

  const moduleRef = await Test.createTestingModule({
    imports: [SharedFeaturesI18nJestModule],
    providers: [JwtRefreshGuard, JwtRefreshStrategy, AuthUserRepoMock, ConfigService],
  }).compile();

  jwtStrat = moduleRef.get<JwtRefreshStrategy>(JwtRefreshStrategy);
  jwtGuard = moduleRef.get<JwtRefreshGuard>(JwtRefreshGuard);
  i18nService = moduleRef.get<I18nService>(I18nService);
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('When validate is called', () => {
  let response: RefreshToken | false;

  describe('with an unregistered mail', () => {
    beforeEach(async () => {
      response = await jwtStrat.validate({
        id: userStub().refreshTokens[0],
        user: { ...plainUserStub(), _id: 'fake' },
      });
    });
    it('Should return false', async () => {
      expect(response).toBe(false);
    });
  });

  describe('with an invalid token', () => {
    beforeEach(async () => {
      response = await jwtStrat.validate({ id: 'false', user: { ...plainUserStub() } });
    });
    it('Should return false', async () => {
      expect(response).toBe(false);
    });
  });

  describe('with a valid token/user pair', () => {
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

describe('When handleRequest is called', () => {
  let mockContext: ExecutionContext;

  beforeEach(() => {
    mockContext = generateI18nMockExecutionContext(i18nService);
  });

  describe('with incorrect data', () => {
    it('Should throw an error', async () => {
      const t = () => {
        jwtGuard.handleRequest(null, false, null, mockContext);
      };

      expect(t).toThrow(UnauthorizedException);
      expect(t).toThrow('validation.INVALID_CREDENTIALS');
    });
  });

  describe('with correct data', () => {
    it('Should return the user and the token id', () => {
      const response = jwtGuard.handleRequest(
        null,
        {
          id: userStub().refreshTokens[0],
          user: plainUserStub(),
        },
        null,
        mockContext
      );

      expect(response).toEqual({
        id: userStub().refreshTokens[0],
        user: plainUserStub(),
      });
    });
  });
});

// Libraries
import { Test } from '@nestjs/testing';
// Mocks
import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { plainUserStub } from '@towech-finance/authentication/repos/user';
import { SharedFeaturesI18nJestModule } from '@towech-finance/shared/features/i18n-nest';
import { generateI18nMockExecutionContext } from './utils';
// Tested elements
import { JwtAuthGuard, JwtAuthStrategy } from './jwt-auth.guard';
// Services
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
// Models
import { UserModel } from '@towech-finance/shared/utils/models';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

const OLD_ENV = process.env;
let jwtStrat: JwtAuthStrategy;
let jwtGuard: JwtAuthGuard;
let i18nService: I18nService;

beforeAll(async () => {
  process.env.AUTH_TOKEN_SECRET = 'pesto';

  const moduleRef = await Test.createTestingModule({
    imports: [SharedFeaturesI18nJestModule],
    providers: [JwtAuthGuard, JwtAuthStrategy, AuthUserRepoMock, ConfigService],
  }).compile();

  jwtStrat = moduleRef.get<JwtAuthStrategy>(JwtAuthStrategy);
  jwtGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
  i18nService = moduleRef.get<I18nService>(I18nService);
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('When validate is called', () => {
  let response: UserModel | false;

  describe('with an unregistered id', () => {
    beforeEach(async () => {
      response = await jwtStrat.validate({ ...plainUserStub(), _id: 'fake' });
    });
    it('Should return the user', () => {
      expect(response).toBe(false);
    });
  });

  describe('with a valid id', () => {
    beforeEach(async () => {
      response = await jwtStrat.validate(plainUserStub());
    });
    it('Should return the user', () => {
      expect(response).toEqual(plainUserStub());
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
    it('Should return the user data', () => {
      const response = jwtGuard.handleRequest(null, plainUserStub(), null, mockContext);

      expect(response).toEqual(plainUserStub());
    });
  });
});

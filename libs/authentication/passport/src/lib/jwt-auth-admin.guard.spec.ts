// Libraries
import { Test } from '@nestjs/testing';
// Mocks
import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { plainAdminStub, plainUserStub } from '@towech-finance/authentication/repos/user';
import { SharedFeaturesI18nJestModule } from '@towech-finance/shared/features/i18n-nest';
import { generateI18nMockExecutionContext } from './utils';
// Tested elements
import { JwtAuthAdminStrategy, JwtAuthAdminGuard } from './jwt-auth-admin.guard';
// Services
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
// Models
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '@towech-finance/shared/utils/models';

const OLD_ENV = process.env;
let jwtStrat: JwtAuthAdminStrategy;
let jwtGuard: JwtAuthAdminGuard;
let i18nService: I18nService;

beforeAll(async () => {
  process.env.AUTH_TOKEN_SECRET = 'pesto';

  const moduleRef = await Test.createTestingModule({
    imports: [SharedFeaturesI18nJestModule],
    providers: [JwtAuthAdminGuard, JwtAuthAdminStrategy, AuthUserRepoMock, ConfigService],
  }).compile();

  jwtStrat = moduleRef.get<JwtAuthAdminStrategy>(JwtAuthAdminStrategy);
  jwtGuard = moduleRef.get<JwtAuthAdminGuard>(JwtAuthAdminGuard);
  i18nService = moduleRef.get<I18nService>(I18nService);
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('When validate is called', () => {
  let respnse: UserModel | false;

  describe('with an admin role id', () => {
    beforeEach(async () => {
      respnse = await jwtStrat.validate(plainAdminStub());
    });

    it('Should return the user', () => {
      expect(respnse).toEqual(plainAdminStub());
    });
  });

  describe('with an user role id', () => {
    beforeEach(async () => {
      respnse = await jwtStrat.validate(plainUserStub());
    });

    it('Should return false', () => {
      expect(respnse).toBe(false);
    });
  });

  describe('with an unregistered id', () => {
    beforeEach(async () => {
      respnse = await jwtStrat.validate({ ...plainUserStub(), _id: 'fake' });
    });

    it('Should return false', () => {
      expect(respnse).toBe(false);
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

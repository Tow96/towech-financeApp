// Libraries
import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { generateI18nMockExecutionContext } from './utils';
// Tested elements
import { LocalAuthGuard, LocalStrategy } from './local-auth.guard';
// Mocks
import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { passwordStub, plainUserStub } from '@towech-finance/authentication/repos/user';
import { SharedFeaturesI18nJestModule } from '@towech-finance/shared/features/i18n-nest';
// Models
import { UserModel } from '@towech-finance/shared/utils/models';
// Services
import { I18nService } from 'nestjs-i18n';

let localStrat: LocalStrategy;
let localGuard: LocalAuthGuard;
let i18nService: I18nService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SharedFeaturesI18nJestModule],
    providers: [LocalAuthGuard, LocalStrategy, AuthUserRepoMock],
  }).compile();

  localStrat = moduleRef.get<LocalStrategy>(LocalStrategy);
  localGuard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
  i18nService = moduleRef.get<I18nService>(I18nService);
});

describe('When validate is called', () => {
  let response: UserModel | false;
  describe('With an invalid mail', () => {
    beforeAll(async () => {
      response = await localStrat.validate('notamail', passwordStub());
    });

    it('Should return false', () => {
      expect(response).toBe(false);
    });
  });

  describe('When validate is called with an invalid password', () => {
    beforeAll(async () => {
      response = await localStrat.validate(plainUserStub().mail, 'not a real password');
    });

    it('Should return false', () => {
      expect(response).toBe(false);
    });
  });

  describe('When validate is called with a valid mail/pass', () => {
    beforeAll(async () => {
      response = await localStrat.validate(plainUserStub().mail, passwordStub());
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
        localGuard.handleRequest(null, false, null, mockContext);
      };

      expect(t).toThrow(UnauthorizedException);
      expect(t).toThrow('validation.INVALID_CREDENTIALS');
    });
  });

  describe('with correct data', () => {
    it('Should return the user data', () => {
      const response = localGuard.handleRequest(null, plainUserStub(), null, mockContext);

      expect(response).toEqual(plainUserStub());
    });
  });
});

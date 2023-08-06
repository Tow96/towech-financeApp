// Libraries lines 97
import { Test } from '@nestjs/testing';
// Tested elements
import { LocalAuthGuard, LocalStrategy } from './local-auth.guard';
// Mocks
import {
  AuthenticationSessionsUserServiceMock,
  plainUserStub,
  passwordStub,
  AuthenticationI18nTestingModule,
} from '@finance/authentication/shared/utils-testing';
import { generateI18nMockExecutionContext } from '../utils/i18n';
// Models
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '@finance/shared/utils-types';
// Services
import { I18nService } from 'nestjs-i18n';

describe('local-auth.guard', () => {
  let localStrat: LocalStrategy;
  let localGuard: LocalAuthGuard;
  let i18nService: I18nService;
  let response: UserModel | false;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [AuthenticationI18nTestingModule],
      providers: [LocalAuthGuard, LocalStrategy, AuthenticationSessionsUserServiceMock],
    }).compile();

    localStrat = moduleRef.get<LocalStrategy>(LocalStrategy);
    localGuard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
    i18nService = moduleRef.get<I18nService>(I18nService);
  });

  describe('When validate is called', () => {
    describe('With an invalid mail', () => {
      it('Should return false', async () => {
        response = await localStrat.validate('notamail', passwordStub());
        expect(response).toBeFalsy();
      });
    });
    describe('When validate is called with an invalid password', () => {
      it('Should return false', async () => {
        response = await localStrat.validate(plainUserStub().mail, 'not a real password');
        expect(response).toBeFalsy();
      });
    });
    describe('When validate is called with a valid mail/pass', () => {
      it('Should return the user', async () => {
        response = await localStrat.validate(plainUserStub().mail, passwordStub());
        expect(response).toEqual(plainUserStub());
      });
    });
  });

  describe('When handleRequest is called', () => {
    let mockContext: ExecutionContext;

    beforeEach(() => (mockContext = generateI18nMockExecutionContext(i18nService)));

    describe('with incorrect data', () => {
      it('Should throw an error', async () => {
        const t = () => localGuard.handleRequest(null, false, null, mockContext);
        expect(t).toThrow(UnauthorizedException);
        expect(t).toThrow('validation.INVALID_CREDENTIALS');
      });
    });
    describe('with correct data', () => {
      it('Should return the user data', () => {
        response = localGuard.handleRequest(null, plainUserStub(), null, mockContext);
        expect(response).toEqual(plainUserStub());
      });
    });
  });
});

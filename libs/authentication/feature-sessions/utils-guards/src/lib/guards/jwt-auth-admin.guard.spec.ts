// Libraries
import { Test } from '@nestjs/testing';
// Mocks
import {
  AuthenticationI18nTestingModule,
  plainAdminStub,
  plainUserStub,
  AuthenticationSessionsUserServiceMock,
} from '@finance/authentication/shared/utils-testing';
import { generateI18nMockExecutionContext } from '../utils/i18n';
// Tested elements
import { JwtAuthAdminStrategy, JwtAuthAdminGuard } from './jwt-auth-admin.guard';
// Services
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { AuthenticationSessionsUserService } from '@finance/authentication/feature-sessions/data-access-user';
// Models
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '@finance/shared/utils-types';

describe('jwt auth admin guard', () => {
  let jwtStrat: JwtAuthAdminStrategy;
  let jwtGuard: JwtAuthAdminGuard;
  let i18nService: I18nService;
  const OLD_ENV = process.env;

  beforeAll(async () => {
    process.env['AUTH_TOKEN_SECRET'] = 'pesto';
    const moduleRef = await Test.createTestingModule({
      imports: [AuthenticationI18nTestingModule],
      providers: [
        JwtAuthAdminGuard,
        JwtAuthAdminStrategy,
        {
          provide: AuthenticationSessionsUserService,
          useValue: AuthenticationSessionsUserServiceMock,
        },
        ConfigService,
      ],
    }).compile();
    jwtStrat = moduleRef.get<JwtAuthAdminStrategy>(JwtAuthAdminStrategy);
    jwtGuard = moduleRef.get<JwtAuthAdminGuard>(JwtAuthAdminGuard);
    i18nService = moduleRef.get<I18nService>(I18nService);
  });
  afterAll(() => (process.env = OLD_ENV));

  describe('When validate is called', () => {
    let respnse: UserModel | false;

    describe('With an admin role id', () => {
      beforeEach(async () => (respnse = await jwtStrat.validate(plainAdminStub())));

      it('Should return the user', () => expect(respnse).toEqual(plainAdminStub()));
    });
    describe('With an user role id', () => {
      beforeEach(async () => (respnse = await jwtStrat.validate(plainUserStub())));

      it('Should return false', () => expect(respnse).toBe(false));
    });
    describe('With an unregistered id', () => {
      beforeEach(
        async () => (respnse = await jwtStrat.validate({ ...plainUserStub(), _id: 'fake' }))
      );

      it('Should return false', () => expect(respnse).toBe(false));
    });
  });

  describe('When handleRequest is called', () => {
    let mockContext: ExecutionContext;

    beforeEach(() => (mockContext = generateI18nMockExecutionContext(i18nService)));

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
});

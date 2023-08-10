// Libraries lines
import { Test } from '@nestjs/testing';
// Mocks
import {
  AuthenticationSessionsUserServiceMock,
  plainUserStub,
  AuthenticationI18nTestingModule,
} from '@finance/authentication/shared/utils-testing';
import { generateI18nMockExecutionContext } from '../utils/i18n';
// Tested elements
import { JwtAuthGuard, JwtAuthStrategy } from './jwt-auth.guard';
// Services
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { AuthenticationSessionsUserService } from '@finance/authentication/feature-sessions/data-access-user';
// Models
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '@finance/shared/utils-types';

const OLD_ENV = process.env;
let jwtStrat: JwtAuthStrategy;
let jwtGuard: JwtAuthGuard;
let i18nService: I18nService;

describe('jwt-auth.guard', () => {
  beforeAll(async () => {
    process.env['AUTH_TOKEN_SECRET'] = 'pesto';

    const moduleRef = await Test.createTestingModule({
      imports: [AuthenticationI18nTestingModule],
      providers: [
        JwtAuthGuard,
        JwtAuthStrategy,
        {
          provide: AuthenticationSessionsUserService,
          useValue: AuthenticationSessionsUserServiceMock,
        },
        ConfigService,
      ],
    }).compile();

    jwtStrat = moduleRef.get<JwtAuthStrategy>(JwtAuthStrategy);
    jwtGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    i18nService = moduleRef.get<I18nService>(I18nService);
  });
  afterAll(() => (process.env = OLD_ENV));

  describe('When validate is called', () => {
    let response: UserModel | false;

    describe('With an unregistered id', () => {
      beforeEach(
        async () => (response = await jwtStrat.validate({ ...plainUserStub(), _id: 'fake' }))
      );
      it('Should return the user', () => expect(response).toBeFalsy());
    });
    describe('With a valid id', () => {
      beforeEach(async () => (response = await jwtStrat.validate(plainUserStub())));
      it('Should return the user', () => expect(response).toEqual(plainUserStub()));
    });
  });

  describe('When handleRequest is called', () => {
    let mockContext: ExecutionContext;

    beforeEach(() => (mockContext = generateI18nMockExecutionContext(i18nService)));

    describe('with incorrect data', () => {
      it('Should throw an error', async () => {
        const t = () => jwtGuard.handleRequest(null, false, null, mockContext);
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

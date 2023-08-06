// Libraries
import { Test } from '@nestjs/testing';
// Tested elements
import { JwtRefreshGuard, JwtRefreshStrategy } from './jwt-refresh.guard';
// Mocks
import {
  AuthenticationFeatureSessionsDataAccessUserServiceMock,
  plainUserStub,
  userStub,
  AuthenticationSharedI18nTestingModule,
} from '@finance/authentication/shared/utils-testing';
import { generateI18nMockExecutionContext } from '../utils/i18n';
// Services
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
// Models
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RefreshToken } from '@finance/shared/utils-types';

describe('jwt-refresh.guard', () => {
  const OLD_ENV = process.env;
  let jwtStrat: JwtRefreshStrategy;
  let jwtGuard: JwtRefreshGuard;
  let i18nService: I18nService;
  let response: RefreshToken | false;

  beforeEach(async () => {
    process.env['REFRESH_TOKEN_SECRET'] = 'pesto';

    const moduleRef = await Test.createTestingModule({
      imports: [AuthenticationSharedI18nTestingModule],
      providers: [
        JwtRefreshGuard,
        JwtRefreshStrategy,
        AuthenticationFeatureSessionsDataAccessUserServiceMock,
        ConfigService,
      ],
    }).compile();

    jwtStrat = moduleRef.get<JwtRefreshStrategy>(JwtRefreshStrategy);
    jwtGuard = moduleRef.get<JwtRefreshGuard>(JwtRefreshGuard);
    i18nService = moduleRef.get<I18nService>(I18nService);
  });
  afterAll(() => (process.env = OLD_ENV));

  describe('When validate is called', () => {
    describe('with an unregistered mail', () => {
      beforeEach(
        async () =>
          (response = await jwtStrat.validate({
            id: userStub().refreshTokens[0],
            user: { ...plainUserStub(), _id: 'fake' },
          }))
      );
      it('Should return false', async () => expect(response).toBeFalsy());
    });
    describe('with an invalid token', () => {
      beforeEach(
        async () =>
          (response = await jwtStrat.validate({ id: 'false', user: { ...plainUserStub() } }))
      );
      it('Should return false', async () => expect(response).toBeFalsy());
    });
    describe('with a valid token/user pair', () => {
      beforeEach(
        async () =>
          (response = await jwtStrat.validate({
            id: userStub().refreshTokens[0],
            user: plainUserStub(),
          }))
      );
      it('Should return the user and the token id', () =>
        expect(response).toEqual({ id: userStub().refreshTokens[0], user: plainUserStub() }));
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
      it('Should return the user and the token id', () => {
        response = jwtGuard.handleRequest(
          null,
          {
            id: userStub().refreshTokens[0],
            user: plainUserStub(),
          },
          null,
          mockContext
        );

        expect(response).toEqual({ id: userStub().refreshTokens[0], user: plainUserStub() });
      });
    });
  });
});

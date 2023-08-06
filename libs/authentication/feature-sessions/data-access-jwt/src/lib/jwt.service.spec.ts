// Libraries
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
// Tested elements
import { AuthenticationSessionsJwtService } from './jwt.service';
// Mocks
import { plainUserStub } from '@finance/authentication/shared/utils-testing';
// Services
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('JWT Service', () => {
  const authTokenSecret = 'testAuthToken';
  const refreshTokenSecret = 'testRefreshToken';
  const OLD_ENV = process.env;
  let tokenService: AuthenticationSessionsJwtService;
  let result: any;

  const validateExpiration = (token: string) => {
    const decodedToken = jwt.decode(token, { json: true })!;
    expect(decodedToken.exp).toBeDefined();
    expect(decodedToken.iat).toBeDefined();
    expect(decodedToken.exp! - decodedToken.iat!).toBeGreaterThan(0);
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env['AUTH_TOKEN_SECRET'] = authTokenSecret;
    process.env['AUTH_TOKEN_EXPIRATION'] = '1m';
    process.env['REFRESH_TOKEN_SECRET'] = refreshTokenSecret;
    process.env['REFRESH_TOKEN_EXPIRATION'] = '30d';
    process.env['REFRESH_SINGLE_TOKEN_EXPIRATION'] = '1h';

    const moduleRef = await Test.createTestingModule({
      providers: [AuthenticationSessionsJwtService, JwtService, ConfigService],
    }).compile();

    tokenService = moduleRef.get<AuthenticationSessionsJwtService>(
      AuthenticationSessionsJwtService
    );
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('when generateAuthToken is called', () => {
    beforeEach(() => (result = tokenService.generateAuthToken(plainUserStub())));

    it('Should return a jwt encoded with the authtoken', () =>
      expect(jwt.verify(result, authTokenSecret, { ignoreExpiration: true })).toEqual(
        expect.objectContaining(plainUserStub())
      ));
    it('Should have an expiration date', () => validateExpiration(result));
  });

  describe('When generateRefreshToken is called', () => {
    describe('With keepSession intent', () => {
      beforeEach(() => (result = tokenService.generateRefreshToken(plainUserStub(), true)));

      it('Should generate an encoded jwt', () =>
        expect(jwt.verify(result.token, refreshTokenSecret, { ignoreExpiration: true })).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            user: plainUserStub(),
          })
        ));
      it('Should have an expiration date', () => validateExpiration(result.token));
    });
    describe('without keepSession intent', () => {
      beforeEach(() => (result = tokenService.generateRefreshToken(plainUserStub())));

      it('Should generate an encoded jwt', () =>
        expect(jwt.verify(result.token, refreshTokenSecret, { ignoreExpiration: true })).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            user: plainUserStub(),
          })
        ));
      it('Should have an expiration date', () => validateExpiration(result.token));
    });
  });
});

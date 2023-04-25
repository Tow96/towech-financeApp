// Libraries
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
// Tested elements
import { AuthenticationTokenService } from './authentication-tokens.service';
// Mocks
import { plainUserStub } from '@towech-finance/authentication/repos/user';
// Services
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const authTokenSecret = 'testAuthToken';
const refreshTokenSecret = 'testRefreshToken';
let tokenService: AuthenticationTokenService;
const OLD_ENV = process.env;

beforeAll(async () => {
  jest.clearAllMocks();
  process.env.AUTH_TOKEN_SECRET = authTokenSecret;
  process.env.AUTH_TOKEN_EXPIRATION = '1m';
  process.env.REFRESH_TOKEN_SECRET = refreshTokenSecret;
  process.env.REFRESH_TOKEN_EXPIRATION = '30d';
  process.env.REFRESH_SINGLE_TOKEN_EXPIRATION = '1h';

  const moduleRef = await Test.createTestingModule({
    providers: [AuthenticationTokenService, JwtService, ConfigService],
  }).compile();

  tokenService = moduleRef.get<AuthenticationTokenService>(AuthenticationTokenService);
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('when generateAuthToken is called', () => {
  let token: string;

  beforeEach(() => {
    token = tokenService.generateAuthToken(plainUserStub());
  });

  it('Should return a jwt encoded with the authtoken', () => {
    expect(jwt.verify(token, authTokenSecret, { ignoreExpiration: true })).toEqual(
      expect.objectContaining(plainUserStub())
    );
  });

  it('Should have an expiration date', () => {
    const decodedToken: jwt.JwtPayload = jwt.decode(token, { json: true });

    expect(decodedToken.exp).toBeDefined();
    expect(decodedToken.exp - decodedToken.iat).toBeGreaterThan(0);
  });
});

describe('when generateRefreshToken is called', () => {
  describe('with keepSession intent', () => {
    let token: string;

    beforeEach(() => (token = tokenService.generateRefreshToken(plainUserStub(), true)));

    it('Should generate an encoded jwt', () => {
      expect(jwt.verify(token, refreshTokenSecret, { ignoreExpiration: true })).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          user: plainUserStub(),
        })
      );
    });

    it('Should have an expiration date', () => {
      const decodedToken: jwt.JwtPayload = jwt.decode(token, { json: true });

      expect(decodedToken.exp).toBeDefined();
      expect(decodedToken.exp - decodedToken.iat).toBeGreaterThan(0);
    });
  });

  describe('without keepSession intent', () => {
    let token: string;

    beforeEach(() => (token = tokenService.generateRefreshToken(plainUserStub())));

    it('Should generate an encoded jwt', () => {
      expect(jwt.verify(token, refreshTokenSecret, { ignoreExpiration: true })).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          user: plainUserStub(),
        })
      );
    });

    it('Should have an expiration date', () => {
      const decodedToken: jwt.JwtPayload = jwt.decode(token, { json: true });

      expect(decodedToken.exp).toBeDefined();
      expect(decodedToken.exp - decodedToken.iat).toBeGreaterThan(0);
    });
  });
});

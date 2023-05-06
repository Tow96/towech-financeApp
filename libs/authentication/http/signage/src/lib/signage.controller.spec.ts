// Libraries
import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as httpMock from 'node-mocks-http';
// Tested elements
import { SignageController } from './signage.controller';
// Mocks
import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { SharedFeaturesLoggerModule } from '@towech-finance/shared/features/logger';
import { plainUserStub, refreshArrStub } from '@towech-finance/authentication/repos/user';
import { UserRoles } from '@towech-finance/shared/utils/models';
import { ConfigService } from '@nestjs/config';
import { AuthenticationTokenService } from '@towech-finance/authentication/tokens';
import { JwtService } from '@nestjs/jwt';

let signController: SignageController;
const authTokenSecret = 'testAuthToken';
const refreshTokenSecret = 'testRefreshToken';
const OLD_ENV = process.env;

beforeAll(async () => {
  jest.clearAllMocks();
  process.env.AUTH_TOKEN_SECRET = authTokenSecret;
  process.env.AUTH_TOKEN_EXPIRATION = '1m';
  process.env.REFRESH_TOKEN_SECRET = refreshTokenSecret;
  process.env.REFRESH_TOKEN_EXPIRATION = '30d';
  process.env.REFRESH_SINGLE_TOKEN_EXPIRATION = '1h';

  const moduleRef = await Test.createTestingModule({
    controllers: [SignageController],
    imports: [SharedFeaturesLoggerModule],
    providers: [AuthUserRepoMock, ConfigService, AuthenticationTokenService, JwtService],
  }).compile();

  signController = moduleRef.get<SignageController>(SignageController);
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('When register is called', () => {
  describe('with a new email', () => {
    let response: any;

    beforeEach(async () => {
      response = await signController.register(
        {
          mail: plainUserStub().mail,
          name: plainUserStub().name,
          role: plainUserStub().role,
        },
        'TESTING'
      );
    });

    it('Should return the new user', () => {
      expect(response).toEqual(plainUserStub());
    });
  });

  describe('with an already registered email', () => {
    it('Should throw an http error', async () => {
      await expect(
        signController.register({ mail: 'registeredmail', name: 'a', role: UserRoles.USER }, 'TEST')
      ).rejects.toBeInstanceOf(HttpException);
    });
  });
});

describe('When login is called with keepSession', () => {
  let response: any;
  let res: any;
  beforeEach(async () => {
    res = httpMock.createResponse();
    response = await signController.login(
      plainUserStub(),
      { keepSession: true, username: 'a', password: 'b' },
      'TEST',
      res
    );
  });

  it('Should return a jwt and a cookie', () => {
    const decodedToken: jwt.JwtPayload = jwt.decode(response.token, { json: true });

    expect(decodedToken).toEqual(expect.objectContaining(plainUserStub()));
    expect(res.cookies.jid).toBeDefined();
  });
});

describe('When refresh is called', () => {
  let response: any;
  beforeEach(async () => {
    response = await signController.refresh({ id: 'TEST', user: plainUserStub() }, 'TEST');
  });

  it('Should return a jwt token', () => {
    const decodedToken: jwt.JwtPayload = jwt.decode(response.token, { json: true });

    expect(decodedToken).toEqual(expect.objectContaining(plainUserStub()));
  });
});

describe('When logout is called', () => {
  let res: any;
  beforeEach(async () => {
    res = httpMock.createResponse();

    await signController.logout({ id: refreshArrStub(), user: plainUserStub() }, 'TEST', res);
  });

  it('Should send an expired empty jid cookie', () => {
    expect(res.cookies.jid).toEqual({
      value: '',
      options: expect.objectContaining({
        expires: new Date('1970-01-01T00:00:00.001Z'),
      }),
    });
  });
});

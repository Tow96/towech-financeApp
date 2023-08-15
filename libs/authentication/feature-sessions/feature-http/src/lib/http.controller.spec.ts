// Libraries
import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as httpMock from 'node-mocks-http';
// Tested elements
import { AuthenticationSessionsHttpController } from './http.controller';
import { ConfigService } from '@nestjs/config';
// Mocks
import {
  AuthenticationPidWinstonLoggerMock,
  AuthenticationSessionsJwtServiceMock,
  AuthenticationUserServiceMock,
  plainUserStub,
  refreshArrStub,
} from '@finance/authentication/shared/utils-testing';
// Models
import { UserRoles } from '@finance/shared/utils-types';
// Services
import { AuthenticationPidWinstonLogger } from '@finance/authentication/shared/logger';
import { AuthenticationUserService } from '@finance/authentication/shared/data-access-user';
import { AuthenticationSessionsJwtService } from '@finance/authentication/sessions/data-access-jwt';

describe('feature-sessions-http', () => {
  let controller: AuthenticationSessionsHttpController;
  let result: any;
  let res: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthenticationSessionsHttpController],
      providers: [
        ConfigService,
        { provide: AuthenticationPidWinstonLogger, useValue: AuthenticationPidWinstonLoggerMock },
        { provide: AuthenticationUserService, useValue: AuthenticationUserServiceMock },
        {
          provide: AuthenticationSessionsJwtService,
          useValue: AuthenticationSessionsJwtServiceMock,
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthenticationSessionsHttpController>(
      AuthenticationSessionsHttpController
    );
  });

  it('Should be defined', () => expect(controller).toBeTruthy());

  describe('When login is called with keepSession', () => {
    beforeEach(async () => {
      res = httpMock.createResponse();
      result = await controller.login(
        plainUserStub(),
        { keepSession: true, username: 'a', password: 'b' },
        'TEST',
        res
      );
    });

    it('Should return a jwt and a cookie', () => {
      const decodedToken: jwt.JwtPayload = jwt.decode(result.token, {
        json: true,
        complete: true,
      })!;
      expect(decodedToken['payload']).toEqual(expect.objectContaining(plainUserStub()));
      expect(res.cookies.jid).toBeDefined();
    });
  });

  describe('When logout is called', () => {
    beforeEach(async () => {
      res = httpMock.createResponse();
      await controller.logout({ id: refreshArrStub(), user: plainUserStub() }, 'TEST', res);
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

  describe('When refresh is called', () => {
    beforeEach(
      async () => (result = await controller.refresh({ id: 'TEST', user: plainUserStub() }, 'TEST'))
    );

    it('Should return a jwt token', () => {
      const decodedToken: jwt.JwtPayload = jwt.decode(result.token, { json: true })!;

      expect(decodedToken).toEqual(expect.objectContaining(plainUserStub()));
    });
  });

  describe('When register is called', () => {
    describe('with a new email', () => {
      beforeEach(
        async () =>
          (result = await controller.register(
            {
              mail: plainUserStub().mail,
              name: plainUserStub().name,
              role: plainUserStub().role,
            },
            'TESTING'
          ))
      );

      it('Should return the new user', () => expect(result).toEqual(plainUserStub()));
    });
    describe('with an already registered email', () => {
      it('Should throw an http error', async () =>
        await expect(
          controller.register({ mail: 'registeredmail', name: 'a', role: UserRoles.USER }, 'TEST')
        ).rejects.toBeInstanceOf(HttpException));
    });
  });
});

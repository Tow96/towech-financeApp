// Libraries
import { Test } from '@nestjs/testing';
// Tested elements
import { AuthenticationUserHttpController } from './http.controller';
// Services
import { AuthenticationPidWinstonLogger } from '@finance/authentication/shared/logger';
import { AuthenticationUserService } from '@finance/authentication/shared/data-access-user';
// Mocks
import {
  AuthenticationPidWinstonLoggerMock,
  AuthenticationUserServiceMock,
  plainUserStub,
} from '@finance/authentication/shared/utils-testing';
import { HttpException } from '@nestjs/common';

describe('feature-user-http', () => {
  let controller: AuthenticationUserHttpController;
  let res: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthenticationUserHttpController],
      providers: [
        { provide: AuthenticationPidWinstonLogger, useValue: AuthenticationPidWinstonLoggerMock },
        { provide: AuthenticationUserService, useValue: AuthenticationUserServiceMock },
      ],
    }).compile();

    controller = moduleRef.get<AuthenticationUserHttpController>(AuthenticationUserHttpController);
  });

  it('Should be defined', () => expect(controller).toBeTruthy());

  describe('when editUser is called', () => {
    it('Should return a 422 error when no properties are given', async () =>
      await expect(controller.editUser(plainUserStub(), {}, 'TEST')).rejects.toBeInstanceOf(
        HttpException
      ));

    it('Should return the updated user', async () => {
      const data = { name: 'user', mail: 'newmail@mail.com' };
      res = await controller.editUser(plainUserStub(), data, 'TEST');

      expect(res).toEqual({ ...plainUserStub(), ...data, accountConfirmed: false });
    });
  });
});

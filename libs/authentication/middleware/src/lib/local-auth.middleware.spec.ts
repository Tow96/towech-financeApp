import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { LocalStrategy } from './local-auth.middleware';
import { AuthUserRepoMock, plainUserStub } from '@towech-finance/authentication/mocks';
import { passwordStub } from '@towech-finance/authentication/repos/user';

let localStrat: LocalStrategy;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [LocalStrategy, AuthUserRepoMock],
  }).compile();

  localStrat = moduleRef.get<LocalStrategy>(LocalStrategy);
});

describe('validate', () => {
  describe('When validate is called with an invalid mail', () => {
    it('Should throw an error', async () => {
      await expect(localStrat.validate('notamail', 'pass')).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('When validate is called with an invalid password', () => {
    it('Should throw an error', async () => {
      await expect(localStrat.validate(plainUserStub().mail, 'pass')).rejects.toBeInstanceOf(
        HttpException
      );
    });
  });

  describe('When validate is called with a valid mail/pass', () => {
    let response: any;

    beforeAll(async () => {
      response = await localStrat.validate(plainUserStub().mail, passwordStub());
    });

    it('Should return the user', () => {
      expect(response).toEqual(plainUserStub());
    });
  });
});

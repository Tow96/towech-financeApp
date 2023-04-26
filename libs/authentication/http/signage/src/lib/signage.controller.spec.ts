// Libraries
import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';

// Tested elements
import { SignageController } from './signage.controller';
// Mocks
import { AuthUserRepoMock } from '@towech-finance/authentication/mocks';
import { SharedFeaturesLoggerModule } from '@towech-finance/shared/features/logger';
import { plainUserStub } from '@towech-finance/authentication/repos/user';
import { UserRoles } from '@towech-finance/shared/utils/models';

let signController: SignageController;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [SignageController],
    imports: [SharedFeaturesLoggerModule],
    providers: [AuthUserRepoMock],
  }).compile();

  signController = moduleRef.get<SignageController>(SignageController);
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

describe('When login is called', () => {
  let response: any;
  beforeEach(async () => {
    response = await signController.login(plainUserStub(), 'TEST');
  });
});

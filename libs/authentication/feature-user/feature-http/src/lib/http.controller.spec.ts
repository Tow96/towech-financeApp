// Libraries
import { Test } from '@nestjs/testing';
// Tested elements
import { AuthenticationUserHttpController } from './http.controller';
// Services
import { ConfigService } from '@nestjs/config';

describe('feature-user-http', () => {
  let controller: AuthenticationUserHttpController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthenticationUserHttpController],
      providers: [ConfigService],
    }).compile();

    controller = moduleRef.get<AuthenticationUserHttpController>(AuthenticationUserHttpController);
  });

  it('Should be defined', () => expect(controller).toBeTruthy());

  // describe('Wh')
});

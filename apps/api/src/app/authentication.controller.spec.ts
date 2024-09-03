import { Test, TestingModule } from '@nestjs/testing';

import { AuthenticationController } from './authentication.controller';
import { RabbitMqService } from './rabbitMQ.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [RabbitMqService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AuthenticationController>(AuthenticationController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});

import { Test } from '@nestjs/testing';

import { RabbitMqService } from './rabbitMQ.service';

describe('AppService', () => {
  let service: RabbitMqService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [RabbitMqService],
    }).compile();

    service = app.get<RabbitMqService>(RabbitMqService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});

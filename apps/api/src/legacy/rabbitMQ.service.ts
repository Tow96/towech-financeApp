import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMqService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}

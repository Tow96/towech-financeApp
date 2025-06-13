import { Controller, Get } from '@nestjs/common';
import { Public } from '@financeapp/users-backend';

@Controller()
export class AppController {
  @Get('health')
  @Public()
  getData() {
    return 'Healthy';
  }
}

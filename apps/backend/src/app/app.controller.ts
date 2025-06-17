import { Controller, Get } from '@nestjs/common';
import { Public } from '../lib/users/lib/public-route.decorator';

@Controller()
export class AppController {
  @Get('health')
  @Public()
  getData() {
    return 'Healthy';
  }
}

import { Controller, Get } from '@nestjs/common';

import { Public } from '@/lib/users';

@Controller()
export class AppController {
  @Get('health')
  @Public()
  getData() {
    return 'Healthy';
  }
}

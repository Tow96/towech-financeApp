import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../clerk-auth.guard';

@Controller()
export class AppController {
  @Get('health')
  @UseGuards(ClerkAuthGuard)
  getData() {
    return 'Healthy';
  }
}

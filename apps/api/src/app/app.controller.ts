import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../users/current-user.decorator';
import { User } from '@financeapp/users-backend';

@Controller()
export class AppController {
  @Get('health')
  getData(@CurrentUser() user: User) {
    return user.id;
  }
}

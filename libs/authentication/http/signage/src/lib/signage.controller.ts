import { Controller, Post } from '@nestjs/common';

export enum SIGNAGE_ROUTES {
  LOGIN = 'login',
}

@Controller()
export class SignageController {
  @Post(SIGNAGE_ROUTES.LOGIN)
  private login() {
    return 'login';
  }
}

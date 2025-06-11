import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClerkAuthGuard } from '../clerk-auth.guard';
import clerkClient from '@clerk/clerk-sdk-node';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseGuards(ClerkAuthGuard)
  getData(@Req() req) {
    console.log(req.headers);

    return clerkClient.users.getUserList();
  }
}

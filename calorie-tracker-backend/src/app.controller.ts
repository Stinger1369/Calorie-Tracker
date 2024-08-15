import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('status')
  getStatus() {
    return { message: 'API is running' };
  }
}

import { Controller, Get } from '@nestjs/common';
@Controller('/')
export class RootController {
  @Get('/')
  getRoot(): string {
    return 'AutoPost AI API is running!';
  }

  @Get('/health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

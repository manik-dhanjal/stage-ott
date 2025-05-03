import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { NoAuth } from './shared/decorator/no-auth.decorator';

@NoAuth()
@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // This is a health check
    return this.appService.getHello();
  }

  @Get('health')
  health(): string {
    // This is a health check
    return 'OK';
  }
}

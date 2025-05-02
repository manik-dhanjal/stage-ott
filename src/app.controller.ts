import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { NoAuth } from './shared/decorator/no-auth.decorator';

@NoAuth()
@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHello(): string {
    // This is a health check endpoint
    return this.appService.getHello();
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { version } from 'os';
import { ApiSecurity } from '@nestjs/swagger';
@ApiSecurity("apiKey")
@Controller(
  {
    version: '1',
  }
)



export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

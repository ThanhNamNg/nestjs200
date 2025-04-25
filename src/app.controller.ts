import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService

  ) {}

  @Get()
  @Render('home')
  getHello() {

    console.log(this.configService.get('PORT'));
    // return this.appService.getHello();
    
  }
}

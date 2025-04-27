import { Controller, Get, Render, Post, UseGuards,Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService

  ) {}

  @Get()
  //@Render('home')
  getHello() {

    return { message: 'Hello World!' };
    //console.log(this.configService.get('PORT'));
    // return this.appService.getHello();
    
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    // Handle login logic here
    return req.user;
  }
}

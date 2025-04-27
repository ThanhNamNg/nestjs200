import { Controller, Get, Render, Post, UseGuards,Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private authService: AuthService

  ) {}

  @Get()
  //@Render('home')
  getHello() {

    return { message: 'Hello World!' };
    //console.log(this.configService.get('PORT'));
    // return this.appService.getHello();
    
  }


  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    // Handle login logic here
    return this.authService.login(req.user); // Return user object
  }

  //@UseGuards(JwtAuthGuard)

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

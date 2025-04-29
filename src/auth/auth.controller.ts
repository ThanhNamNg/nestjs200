import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/decorator/customize';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

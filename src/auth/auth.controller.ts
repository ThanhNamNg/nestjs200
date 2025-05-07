import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Req,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import {
  CreateUserDto,
  CreateUserDtoAuth,
} from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { Response } from 'express';

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

  @ResponseMessage('Đăng nhập thành công')
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    // Handle login logic here
    return this.authService.login(req.user, response); // Return user object
  }

  @ResponseMessage('Register a new user')
  @Public()
  @Post('/register')
  async handleRegister(@Body() CreateUserDtoAuth: CreateUserDtoAuth) {
    //Trong NestJS, decorator @Body() được sử dụng trong controller để trích xuất dữ liệu từ phần thân (body)
    // của HTTP request, thường là trong các request như POST, PUT, hoặc PATCH.
    // Handle login logic here
    const newUser = await this.authService.register(CreateUserDtoAuth); // Return user object
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  //@UseGuards(JwtAuthGuard)

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ResponseMessage('lấy thông tin thành công')
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    return await { user };
  }
}

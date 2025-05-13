import {
  Controller,
  Get,
  Post,
  UseGuards,
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
import { Request } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RolesService,
  ) {}

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
  getProfile(@Req() req) {
    return req.user;
  }

  @ResponseMessage('lấy thông tin thành công')
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    const permission = (await this.roleService.findOne(user.role._id)) as any;
    user.permissions = permission.permissions;
    return await { user };
  }

  @ResponseMessage('lấy thông tin user từ refresh token thành công')
  @Public()
  @Get('/refrest')
  async handleRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    //Nếu không có passthrough: true, dòng return { access_token: ... } sẽ không hoạt động, vì Nest sẽ ngừng xử lý response khi bạn dùng @Res().
  ) {
    const refrest_token = req.cookies['refreshToken'];
    return this.authService.processNewToken(refrest_token, response);
  }

  @ResponseMessage('Đăng xuất thành công')
  @Get('/logout')
  async logout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }
}

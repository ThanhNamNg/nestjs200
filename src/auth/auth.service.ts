import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Public,
  RESPONSE_MESSAGE,
  ResponseMessage,
  User,
} from 'src/decorator/customize';
import {
  CreateUserDto,
  CreateUserDtoAuth,
} from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/schemas/user.schemas';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      //check if user exists
      const isPasswordValid = await this.usersService.isValidPassword(
        pass,
        user.password,
      );
      if (isPasswordValid) {
        // check password
        // Remove password from user object before returning
        const { password, ...result } = user;
        return result;
      }
    }
  }

  async register(CreateUserDtoAuth: CreateUserDtoAuth) {
    try {
      const createdUser = await this.usersService.createForAdmin(
        CreateUserDtoAuth,
      );

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = (user as any)._doc;

    //là destructuring assignment trong JavaScript/TypeScript, dùng để trích xuất các thuộc tính cụ thể từ đối tượng user.

    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const rf_token = this.createRefreshToken(payload);
    this.usersService.updateUserToken(rf_token, _id);

    response.cookie('refreshToken', rf_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPRIE')) * 1000,
    });
    return {
      access_token: this.jwtService.sign(payload), //Tạo access token từ payload và lưu vào thuộc tính access_token.
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  createRefreshToken = (payload: any) => {
    const refrest_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPRIE'),
    });
    return refrest_token;
  };

  processNewToken = async (rf_token: string, response: Response) => {
    try {
      // giai ma refrersh token
      this.jwtService.verify(rf_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.findUserByRefreshToken(rf_token);

      if (user) {
        const { _id, name, email, role } = (user as any)._doc;

        //là destructuring assignment trong JavaScript/TypeScript, dùng để trích xuất các thuộc tính cụ thể từ đối tượng user.

        const payload = {
          sub: 'token login',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };
        const new_rf_token = this.createRefreshToken(payload);
        this.usersService.updateUserToken(new_rf_token, _id);

        response.clearCookie('refreshToken');

        response.cookie('refreshToken', new_rf_token, {
          httpOnly: true,
          maxAge:
            ms(this.configService.get<string>('JWT_REFRESH_EXPRIE')) * 1000,
        });
        return {
          access_token: this.jwtService.sign(payload), //Tạo access token từ payload và lưu vào thuộc tính access_token.
          user: {
            _id,
            name,
            email,
            role,
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh Token không hợp lệ vui lòng đăng nhập lại.',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Refresh Token không hợp lệ vui lòng đăng nhập lại.',
      );
    }
  };
}

import { Injectable } from '@nestjs/common';
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

  async login(user: IUser) {
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
    return {
      access_token: this.jwtService.sign(payload),
      rf_token: this.createRefreshToken(payload),
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
}

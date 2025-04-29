import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(user: IUser) {
    const { _id, name, email, role } = user;

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
      _id,
      name,
      email,
      role,
    };
  }
}

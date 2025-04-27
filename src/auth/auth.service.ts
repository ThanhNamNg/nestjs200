import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

constructor(
  private usersService: UsersService,
   private jwtService: JwtService

) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if(user) { //check if user exists
      const isPasswordValid = await this.usersService.isValidPassword(pass, user.password);
      if (isPasswordValid) { // check password
        // Remove password from user object before returning
        const { password, ...result } = user;
        return result;
      }
    }
  }

  async login(user: any) {
    const payload = { 
      username: user.email,
      sub: user._id
     };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

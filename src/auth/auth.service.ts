import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

constructor(private usersService: UsersService) {}

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
}

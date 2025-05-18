import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private roleService: RolesService, // Inject the RolesService to use it in the validate method
  ) {
    // cấu hình jwt
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'), // Use the secret from the config service
    });
  }

  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;

    // check password
    // Remove password from user object before returning
    const userRole = role as unknown as { _id: string; name: string };
    const temp = await this.roleService.findOne(userRole._id);

    return {
      // req.user trả dữ liệu về cho controller
      _id,
      name,
      email,
      role,
      permissions: temp?.permissions ?? [],
    };
  }
}

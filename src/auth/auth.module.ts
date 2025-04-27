import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [UsersModule,
    PassportModule,
    JwtModule.registerAsync({ // how to use async config with .env file
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn : configService.get<string>('JWT_EXPIRES_IN'),
            }, // Set token expiration time
          }),
          inject: [ConfigService],
        }),
  ],
  controllers: [],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  exports: [AuthService], // Export AuthService and JwtModule for use in other modules
})
export class AuthModule {}

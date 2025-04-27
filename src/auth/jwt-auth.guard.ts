
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// AuthGuard('jwt') nghĩa là sử dụng cái strategy tên 'jwt' để xác thực.

// 'jwt' chính là cái tên mặc định mà JwtStrategy đăng ký vào Passport khi bạn viết extends PassportStrategy(Strategy) (cái Strategy đó là từ passport-jwt ra).

// Thành ra, JwtAuthGuard sẽ tự động kích hoạt JwtStrategy mỗi khi một request vào.



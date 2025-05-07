import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector)); // <-- Đăng ký interceptor global

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
      },
      // Tự động loại bỏ trường không có trong DTO

      //       Khi bạn dùng ValidationPipe, NestJS sẽ:

      // Chuyển đổi dữ liệu JSON nhận được thành instance của class DTO (dùng class-transformer).

      // Kiểm tra dữ liệu theo các decorator như @IsString(), @IsEmail(), @MinLength(), v.v. (dùng class-validator).

      // Tùy vào config (ví dụ whitelist), nó có thể:

      // Xóa field không khai báo trong DTO.

      // Báo lỗi nếu có field lạ (forbidNonWhitelisted: true).

      // Tự động ép kiểu (transform: true).
    ),
  );

  //congfig cookie
  app.use(cookieParser());

  app.enableCors(); // Cho phép mọi domain gọi

  //cofig version
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  await app.listen(configService.get<string>('PORT') || 3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], // tạo model từ schema 

  //User.name chính là tên của model trong MongoDB (users - chữ thường + số nhiều). 🔸 UserSchema là schema bạn vừa định nghĩa
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

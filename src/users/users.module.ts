import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ], // tạo model từ schema

  //User.name chính là tên của model trong MongoDB (users - chữ thường + số nhiều). 🔸 UserSchema là schema bạn vừa định nghĩa
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}

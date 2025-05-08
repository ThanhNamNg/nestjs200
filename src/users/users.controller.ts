import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TestGuard } from './test.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('Dang ky thành công')
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    const newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }
  @ResponseMessage('Tìm tất cả user và phân trang thành công')
  //@UseGuards(TestGuard) block không cho người dùng vào chức năng gì đó
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage('Tim thanh cong user theo id')
  @Get(':id')
  @Public()
  findOne(@Param('id') id) {
    return this.usersService.findOne(id);
  }
  @ResponseMessage('Cap nhat user thành công')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return await this.usersService.update(id, updateUserDto, user);
  }
  @ResponseMessage('Xóa user thành công')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.usersService.remove(id, user);
    // return {
    //   _id: newUser._id,
    //   createdAt: newUser.createdAt,
    // };
  }
}

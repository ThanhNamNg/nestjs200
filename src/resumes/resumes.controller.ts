import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';

import { UpdateResumeDto } from './dto/update-resume.dto';
import { CreateUserCVDto } from './dto/create-resume.dto';
import { use } from 'passport';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ResponseMessage('Ttao CV thành công')
  @Post()
  create(@Body() createUserCVDto: CreateUserCVDto, @User() user: IUser) {
    return this.resumesService.create(createUserCVDto, user);
  }

  @ResponseMessage('Tìm và phân trang CV thành công')
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  //Path parameter
  @ResponseMessage('Tìm theo id thành công')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @ResponseMessage(' Cập nhật trạng thái thành công')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @ResponseMessage(' Xoa resume thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumesService.remove(id);
  }

  @ResponseMessage('Tim CV theo user thành công')
  @Post('by-user')
  findCVByUser(@User() user: IUser) {
    return this.resumesService.findCVByUser(user);
  }
}

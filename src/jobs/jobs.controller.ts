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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@ResponseMessage('Thêm công việc thành công')
@Controller('job')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
  @ResponseMessage('Tạo công việc thành công')
  @Post()
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách công việc thành công')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }
  //   @Query() (không truyền tên cụ thể) sẽ lấy toàn bộ query params của URL dưới dạng một object.

  // Vì bạn gán nó vào qs: string, điều này sai kiểu dữ liệu — thực tế qs sẽ là một object, không phải string.

  @ResponseMessage('Lấy công việc theo id thành công')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
  @ResponseMessage('Update công việc thành công')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }
  @ResponseMessage('Xóa job thành công')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}

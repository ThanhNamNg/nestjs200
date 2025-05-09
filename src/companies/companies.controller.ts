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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ResponseMessage('Tạo công ty thành công')
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @ResponseMessage('Lấy danh sách và phân trang thành công')
  @Public()
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @ResponseMessage('Sửa công ty thành công')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  //   @Patch(':id'): Decorator này định nghĩa một route HTTP PATCH, ví dụ: PATCH /companies/5.

  // @Param('id') id: string: Lấy giá trị của tham số :id trong URL. Ví dụ: nếu client gọi PATCH /companies/5, thì id sẽ là '5'.

  // @Body() updateCompanyDto: UpdateCompanyDto: Lấy dữ liệu JSON từ body của request, gán vào biến updateCompanyDto, kiểu UpdateCompanyDto.

  // +id: Chuyển chuỗi id sang kiểu số (number).

  @Delete(':id')
  @ResponseMessage('Xóa công ty thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}

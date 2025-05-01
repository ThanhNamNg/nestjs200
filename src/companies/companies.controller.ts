import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

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
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}

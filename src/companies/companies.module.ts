import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company, CompanySchema } from './schemas/company.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])], // tạo model từ schema
  //Company.name chính là tên của model trong MongoDB (companies - chữ thường + số nhiều). 🔸 CompanySchema là schema bạn vừa định nghĩa
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}

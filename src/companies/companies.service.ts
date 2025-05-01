import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    try {
      const company = await this.companyModel.findOne({
        name: createCompanyDto.name,
      });

      if (company) {
        return 'Company already exists';
      } else {
        // Tạo mới công ty
        const company = await this.companyModel.create({
          ...createCompanyDto,
          createdBy: {
            _id: user._id,
            email: user.email,
          },
        });
        return 'This action adds a new company + ' + company;
      }
    } catch (error) {
      return `Error creating company loi roi wi si ma ${error}`;
    }
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}

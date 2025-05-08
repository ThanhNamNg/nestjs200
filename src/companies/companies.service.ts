import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

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

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = '-updatedAt';
    }

    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    const { _id, name, email, role } = user; // lấy các trường thông tin cụ thể từ user
    try {
      const company = await this.companyModel.findById(id);
      if (!company) {
        return 'Company not found';
      } else {
        const updatedCompany = await this.companyModel.updateOne(
          { _id: id },
          {
            //findByIdAndUpdate(id, update, options?)
            ...updateCompanyDto,
            updatedBy: {
              _id,
              email,
            },
          },
          { new: true },
        ); // thêm để trả về document đã cập nhật

        return updatedCompany;
      }
    } catch (error) {
      return `Lỗi khi update company ${error}`;
    }
  }

  async remove(id: string, user: IUser) {
    const { _id, email, role } = user; // lấy các trường thông tin cụ thể từ user
    try {
      const company = await this.companyModel.findOne({
        _id: id,
        //deleted: false,
      });

      if (!company) {
        return 'Company not found';
      } else {
        await this.companyModel.findByIdAndUpdate(
          id,
          {
            deletedBy: {
              _id: user._id,
              email: user.email,
            },
          },
          { new: true },
        );

        const deletedCompany = await this.companyModel.softDelete({ _id: id });
        return deletedCompany;
      }
    } catch (error) {
      return `Lỗi khi xóa company ${error}`;
    }
  }
}

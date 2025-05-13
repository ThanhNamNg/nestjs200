import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { use } from 'passport';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schemas';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createUserCVDto: CreateUserCVDto, user: IUser) {
    try {
      const { url, companyId, jobId } = createUserCVDto;
      const resume = {
        email: user.email,
        userId: user._id,
        url,
        status: 'PENDING',
        companyId,
        jobId,
        history: [
          {
            status: 'PENDING',
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },

            createdBy: {
              _id: user._id,
              email: user.email,
            },
          },
        ],
      };

      const newResume = await this.resumeModel.create(resume);
      return {
        _id: newResume._id,
        createdAt: newResume.createdAt,
      };
    } catch (error) {
      throw new BadRequestException('Tạo CV không thành công');
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    try {
      const { filter, sort, population, projection } = aqp(qs); //api query params
      //Hàm aqp() từ thư viện api-query-params giúp bạn chuyển query string thành object MongoDB gồm:

      //Thông tin để dùng .populate() trong Mongoose — dùng cho các trường có ref như companyId, userId.

      //Giới hạn các trường được trả về. Ví dụ: { email: 1, status: 1 } nghĩa là chỉ lấy 2 trường email và status.

      delete filter.current;
      delete filter.pageSize;

      let offset = (+currentPage - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;

      const totalItems = (await this.resumeModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);

      const result = await this.resumeModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any)
        .populate(population)
        .select(projection)
        .exec();

      return {
        meta: {
          current: currentPage,
          pageSize: limit,
          pages: totalPages,
          total: totalItems,
        },
        result,
      };
    } catch (error) {
      throw new Error('Error finding jobs: ' + error.message);
    }
  }

  async findOne(id: string) {
    try {
      const resume = await this.resumeModel.findById(id);
      if (!resume) {
        throw new BadRequestException('CV không tồn tại');
      }
      return resume;
    } catch (error) {
      throw new BadRequestException('CV không tồn tại');
    }
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    try {
      const { status } = updateResumeDto;
      const resume = await this.resumeModel.updateOne(
        { _id: id },
        {
          $set: {
            ...updateResumeDto,

            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },

          $push: {
            history: {
              status: status,
              updatedAt: new Date(),
              updatedBy: {
                _id: user._id,
                email: user.email,
              },
            },
          },
        },
      );

      return resume;
    } catch (error) {
      throw new BadRequestException('Cập nhật CV không thành công');
    }
  }

  async remove(id: string) {
    try {
      const resume = await this.resumeModel.softDelete({ _id: id });
      return resume;
    } catch (error) {
      throw new BadRequestException('Xóa CV không thành công');
    }
  }

  async findCVByUser(user: IUser) {
    try {
      const resumes = await this.resumeModel
        .find({ userId: user._id })
        .sort({
          createdAt: -1,
        })
        .populate([
          { path: 'companyId', select: { name: 1 } },
          { path: 'jobId', select: { name: 1 } },
        ]);
      return resumes;
    } catch (error) {
      throw new BadRequestException('Lỗi tìm CV theo user');
    }
  }
}

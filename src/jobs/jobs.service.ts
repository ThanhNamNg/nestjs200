import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    try {
      const newJob = await this.jobModel.create({
        ...createJobDto,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      return {
        _id: newJob._id,
        createdAt: newJob.createdAt,
      };
    } catch (error) {
      throw new Error('Error creating job: ' + error.message);
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    try {
      const { filter, sort, population } = aqp(qs);
      //Hàm aqp() từ thư viện api-query-params giúp bạn chuyển query string thành object MongoDB gồm:

      delete filter.current;
      delete filter.pageSize;

      let offset = (+currentPage - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;

      const totalItems = (await this.jobModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);

      const result = await this.jobModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any)
        .populate(population);

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
      const job = await this.jobModel.findById(id);
      if (!job) {
        throw new Error('Job not found');
      }
      return job;
    } catch (error) {
      throw new Error('Error finding job: ' + error.message);
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    try {
      const job = await this.jobModel.findById(id);
      if (!job) {
        throw new Error('Job not found');
      }
      const result = await this.jobModel.updateOne(
        { _id: id },
        {
          $set: {
            ...updateJobDto,
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      );

      return result;
    } catch (error) {
      throw new Error('Error updating job: ' + error.message);
    }
  }

  async remove(id: string, user: IUser) {
    try {
      const job = await this.jobModel.findOneAndUpdate(
        {
          _id: id,
          //deleted: false,
        },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
        {
          new: true, // trả về document đã cập nhật
        },
      );
      if (job) {
        const deletedJob = await this.jobModel.softDelete({ _id: id });
        return deletedJob;
      } else {
        throw new Error('Job not found');
      }
    } catch (error) {
      throw new Error('Error removing job: ' + error.message);
    }
  }
}

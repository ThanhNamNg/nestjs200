import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { subscriberDocument } from './schemas/subscriber.sechma';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from 'rxjs';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<subscriberDocument>,
  ) {}
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { email } = createSubscriberDto;
    // Kiểm tra subscriber đã tồn tại
    const isExist = await this.subscriberModel.findOne({
      email: email,
    });
    if (isExist) {
      throw new BadRequestException('Subscriber already exists');
    }

    // Tạo subscriber mới
    const newSubscriber = await this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return newSubscriber;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    try {
      const { filter, sort, population } = aqp(qs);
      //Hàm aqp() từ thư viện api-query-params giúp bạn chuyển query string thành object MongoDB gồm:

      delete filter.current;
      delete filter.pageSize;

      let offset = (+currentPage - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;

      const totalItems = (await this.subscriberModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);

      const result = await this.subscriberModel
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
      throw new Error('Error finding permissions: ' + error.message);
    }
  }
  async findOne(id: string) {
    return await this.subscriberModel.findById(id);
  }

  async update(
    id: string,
    updateSubscriberDto: UpdateSubscriberDto,
    user: IUser,
  ) {
    const checkSubscriber = await this.subscriberModel.findOne({ _id: id });
    if (!checkSubscriber) {
      throw new BadRequestException('Subscriber not found');
    }

    const updatedSubscriber = await this.subscriberModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateSubscriberDto,
        },
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return updatedSubscriber;
  }

  async remove(id: string) {
    const checkPermission = await this.subscriberModel.findOne({ _id: id });
    if (!checkPermission) {
      throw new BadRequestException('Permission not found');
    }

    const deletePermission = await this.subscriberModel.softDelete({ _id: id });
    return deletePermission;
  }
}

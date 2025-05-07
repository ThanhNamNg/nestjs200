import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, CreateUserDtoAuth } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import * as bcrypt from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } =
      createUserDto;

    const checkEmail = await this.userModel.findOne({
      email: email,
    });
    if (checkEmail) {
      throw new BadRequestException('Email: ' + email + ' đã tồn tại');
    }
    const hashPassword = this.getHashPassword(createUserDto.password);

    const newCreateUserDto = {
      ...createUserDto, // Sao chép toàn bộ các field từ createUserDto
      password: hashPassword, // Ghi đè field password bằng password đã mã hóa
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    };
    let newUser = await this.userModel.create(newCreateUserDto);

    return newUser;
  }

  async createForAdmin(createUserDtoAuth: CreateUserDtoAuth) {
    const hashPassword = this.getHashPassword(createUserDtoAuth.password);
    const checkEmail = await this.userModel.findOne({
      email: createUserDtoAuth.email,
    });
    if (checkEmail) {
      throw new BadRequestException(
        'Email: ' + createUserDtoAuth.email + ' đã tồn tại',
      );
    }
    const newCreateUserDto = {
      ...createUserDtoAuth, // Sao chép toàn bộ các field từ CreateUserDtoAuth
      role: 'USER',
      password: hashPassword, // Ghi đè field password bằng password đã mã hóa
    };
    let user = await this.userModel.create(newCreateUserDto);

    return user;
  }
  async findAll(currentPage: number, limit: number, qs) {
    const { filter, projection, population } = aqp(qs);

    delete filter.page;
    delete filter.limit;

    let { sort } = aqp(qs);
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = '-updatedAt';
    }

    const result = await this.userModel
      .find(filter)
      .select('-password')
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

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id);
      const { password, ...newUser } = user.toObject();
      //.toObject() chuyển document Mongoose thành object JS thường.

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return newUser;
    } catch (error) {
      throw new NotFoundException('Error finding user');
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Error finding user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    try {
      const newUser = await this.userModel.updateOne(
        { _id: id },
        {
          ...updateUserDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
        {
          new: true,
        },
      );
      //       Đây là options:
      // - Nếu new: true ➔ hàm sẽ trả về bản ghi mới đã được cập nhật.
      // - Nếu không có new: true (hoặc new: false) ➔ trả về bản ghi cũ trước khi update.
      if (!newUser) {
        throw new NotFoundException('User not found');
      }
      return newUser;
    } catch (error) {
      throw new NotFoundException('Error updating user');
    }
  }

  async remove(id: string, user1: IUser) {
    try {
      await this.userModel.findByIdAndUpdate(
        id,
        {
          deletedBy: {
            _id: user1._id,
            email: user1.email,
          },
        },
        { new: true },
      );
      const user = await this.userModel.softDelete({ _id: id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Error deleting user');
    }
  }

  updateUserToken = async (refreshToken: string, id: string) => {
    try {
      const newUser = await this.userModel.updateOne(
        { _id: id },
        {
          refreshToken,
        },
        {
          new: true,
        },
      );
      //       Đây là options:
      // - Nếu new: true ➔ hàm sẽ trả về bản ghi mới đã được cập nhật.
      // - Nếu không có new: true (hoặc new: false) ➔ trả về bản ghi cũ trước khi update.
      if (!newUser) {
        throw new NotFoundException('User not found');
      }
      return newUser;
    } catch (error) {
      throw new NotFoundException('Error updating user');
    }
  };
}

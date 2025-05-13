import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;

    const checkPermission = await this.permissionModel.findOne({
      apiPath,
      method,
    });

    if (checkPermission) {
      throw new BadRequestException('Permission already exists');
    }

    const newPermission = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newPermission._id,
      createdAt: newPermission.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    try {
      const { filter, sort, population } = aqp(qs);
      //Hàm aqp() từ thư viện api-query-params giúp bạn chuyển query string thành object MongoDB gồm:

      delete filter.current;
      delete filter.pageSize;

      let offset = (+currentPage - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;

      const totalItems = (await this.permissionModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);

      const result = await this.permissionModel
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
    try {
      const permission = await this.permissionModel.findById(id);
      if (!permission) {
        throw new BadRequestException('Permission not found');
      }
      return permission;
    } catch (error) {
      throw new BadRequestException('Permission not found');
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const checkPermission = await this.permissionModel.findOne({ _id: id });
    if (!checkPermission) {
      throw new BadRequestException('Permission not found');
    }

    const newPermission = await this.permissionModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updatePermissionDto,
        },
      },
    );
    return newPermission;
  }

  async remove(id: string) {
    const checkPermission = await this.permissionModel.findOne({ _id: id });
    if (!checkPermission) {
      throw new BadRequestException('Permission not found');
    }

    const deletePermission = await this.permissionModel.softDelete({ _id: id });
    return deletePermission;
  }
}

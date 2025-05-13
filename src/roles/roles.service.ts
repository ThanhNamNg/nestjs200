import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';

import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;

    const checkRole = await this.roleModel.findOne({ name });
    if (checkRole) {
      throw new BadRequestException('Role already exists');
    }

    const newRole = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newRole._id,
      createdAt: newRole.createdAt,
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

      const totalItems = (await this.roleModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);

      const result = await this.roleModel
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
      throw new Error('Error finding roles: ' + error.message);
    }
  }
  async findOne(id: string) {
    try {
      const Role = await this.roleModel.findById(id).populate({
        path: 'permissions',
        select: { _id: 1, apiPath: 1, method: 1, name: 1, modeule: 1 },
      });
      //       path: 'permissions': trường trong Role model chứa danh sách ID liên kết đến collection permissions.

      // select: chỉ định trường nào sẽ được lấy từ mỗi tài liệu permission. Trong trường hợp này:

      // _id: 1: lấy trường _id

      // apiPath: 1: lấy đường dẫn API

      // method: 1: lấy phương thức HTTP (GET, POST, v.v.)

      if (!Role) {
        throw new BadRequestException('Role not found');
      }
      return Role;
    } catch (error) {
      throw new BadRequestException('Role not found');
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const newRole = await this.roleModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updateRoleDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      },
    );
    return newRole;
  }

  async remove(id: string, user: IUser) {
    const checkRole = await this.roleModel.findOne({ _id: id });
    if (!checkRole) {
      throw new BadRequestException('Role not found');
    } else if (checkRole.name === ADMIN_ROLE) {
      throw new BadRequestException('Cannot delete ADMIN role');
    }
    this.roleModel.updateOne(
      { _id: id },
      {
        $set: {
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      },
    );

    const deleteRole = await this.roleModel.softDelete({ _id: id });
    return deleteRole;
  }
}

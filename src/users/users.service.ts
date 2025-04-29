import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import * as bcrypt from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>){}

  getHashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;

  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto) {
  const hashPassword = this.getHashPassword(createUserDto.password);

  const newCreateUserDto ={
    ...createUserDto,// Sao chép toàn bộ các field từ createUserDto
    password: hashPassword,  // Ghi đè field password bằng password đã mã hóa
   
  }
  let user =  await this.userModel.create(newCreateUserDto);

 
  
  return 'This action adds a new user + ' + user;
  }

  async findAll() {
    try{
      const users = await this.userModel.find();
      if (!users) {
        throw new NotFoundException('No users found');
      }
      return users;
    }catch (error) {
      throw new NotFoundException('Error finding users');
    }
  }

  // findOne(id: string) {
    
  //    return this.userModel.findById({_id : id})
  //    .then((user) => {
  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }
  //     return user;
  //   }).catch(() => {
  //     throw new NotFoundException('Error finding user');
  //   });
   
  // }

    async findOne(id: string) {
      try {
        const user = await this.userModel.findById(id);
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      }catch (error) {
        throw new NotFoundException('Error finding user');
      }
    }

    async findOneByEmail(email: string) {
      try {
        const user = await this.userModel.findOne({email}).lean();
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      }catch (error) {
        throw new NotFoundException('Error finding user');
      }
    }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });  
                                                                                              //       Đây là options:
                                                                                              // - Nếu new: true ➔ hàm sẽ trả về bản ghi mới đã được cập nhật.
                                                                                              // - Nếu không có new: true (hoặc new: false) ➔ trả về bản ghi cũ trước khi update.
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Error updating user');
    }
  }

  async remove(id: string) {
   try { 
    const user = await this.userModel.softDelete({_id:id});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
   }catch (error) {
      throw new NotFoundException('Error deleting user');
    }
  }
  
}

import { Type } from 'class-transformer';
import * as validator from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @validator.IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @validator.IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @validator.IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @validator.IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @validator.IsString({ message: 'Mật khẩu phai la string' })
  @validator.IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @validator.IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;

  @validator.IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: string;

  @validator.IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @validator.IsNotEmpty({ message: 'Role không được để trống' })
  role: string;

  @validator.IsNotEmptyObject()
  @validator.IsObject({ message: 'Công ty có id và name' })
  @validator.ValidateNested({ message: 'Công ty cơ mà' })
  @Type(() => Company)
  company: Company;
}

export class CreateUserDtoAuth {
  @validator.IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @validator.IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @validator.IsString({ message: 'Mật khẩu phai la string' })
  @validator.IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @validator.IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;

  @validator.IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: string;

  @validator.IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;
}

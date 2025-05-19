import {
  IsString,
  IsBoolean,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  isEmail,
  IsEmail,
} from 'class-validator';
export class CreateSubscriberDto {
  @IsString({ message: 'Tên không được để trống và phải là chuỗi.' })
  name: string;

  @IsNotEmpty({ message: 'Email không được để trống.' })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  email: string;

  @IsNotEmpty({ message: 'Skill không được để trống.' })
  @IsArray({ message: 'Danh sách skill phải là một mảng.' })
  @IsString({ each: true, message: 'Mỗi skill phải là string.' })
  skills: string[];
}

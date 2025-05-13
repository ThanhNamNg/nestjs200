import { IsString, IsBoolean, IsArray, IsMongoId } from 'class-validator';
export class CreatePermissionDto {
  @IsString({ message: 'Tên không được để trống và phải là chuỗi.' })
  name: string;

  @IsString({ message: 'Đường dẫn API không được để trống và phải là chuỗi.' })
  apiPath: string;

  @IsString({
    message: 'Phương thức (method) không được để trống và phải là chuỗi.',
  })
  method: string;

  @IsString({ message: 'Tên module không được để trống và phải là chuỗi.' })
  module: string;
}

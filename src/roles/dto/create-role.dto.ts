import { IsString, IsBoolean, IsArray, IsMongoId } from 'class-validator';
export class CreateRoleDto {
  @IsString({ message: 'Tên không được để trống và phải là chuỗi.' })
  name: string;

  @IsString({ message: 'Mô tả phải là chuỗi.' })
  description: string;

  @IsBoolean({ message: 'Trạng thái hoạt động phải là kiểu boolean.' })
  isActive: boolean;

  @IsArray({ message: 'Danh sách quyền phải là một mảng.' })
  @IsMongoId({ each: true, message: 'Mỗi quyền phải là một ObjectId hợp lệ.' })
  permissions: string[];
}

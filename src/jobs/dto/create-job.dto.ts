import * as validator from 'class-validator';
export class CreateJobDto {
  @validator.IsNotEmpty({ message: 'Tên công việc không được để trống' })
  name: string;

  @validator.IsArray({ message: 'Kỹ năng phải là một mảng' })
  @validator.ArrayNotEmpty({ message: 'Kỹ năng không được để trống' })
  skills: string[];

  @validator.IsNotEmpty({ message: 'Công ty không được để trống' })
  company: {
    _id: string;
    name: string;
    logo: string;
  };
  @validator.IsNotEmpty({ message: 'Mức lương không được để trống' })
  salary: number;

  @validator.IsNotEmpty({ message: 'Địa chị của job không được để trống' })
  location: number;

  @validator.IsNotEmpty({ message: 'Số lượng không được để trống' })
  quantity: number;

  @validator.IsNotEmpty({ message: 'Cấp độ không được để trống' })
  level: string;

  @validator.IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @validator.IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  startDate: Date;

  @validator.IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  endDate: Date;

  @validator.IsNotEmpty({ message: 'Trạng thái không được để trống' })
  isActive: Date;
}

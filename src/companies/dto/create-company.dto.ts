import * as validator from 'class-validator';

export class CreateCompanyDto {
  @validator.IsNotEmpty({ message: 'Tên công ty không được để trống' })
  name: string;

  @validator.IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @validator.IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;
}

// DTO dùng để:

// Xác định dữ liệu mà client được phép gửi hoặc nhận qua API.

// Giới hạn, kiểm soát và validate dữ liệu đầu vào từ request (body, param...).

// DTO: Kiểm soát dữ liệu đi vào/ra ứng dụng (qua API).

// Model: Kiểm soát dữ liệu lưu trữ trong database.

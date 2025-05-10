import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';

import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'UserId không được để trống' })
  @IsMongoId({ message: 'JobId không hợp lệ phải là mongoID' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: string;

  @IsNotEmpty({ message: 'CompanyId không được để trống' })
  @IsMongoId({ message: 'JobId không hợp lệ phải là mongoID' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'JobId không được để trống' })
  @IsMongoId({ message: 'JobId không hợp lệ phải là mongoID' })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCVDto {
  @IsNotEmpty({ message: 'Url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'CompanyId không được để trống' })
  @IsMongoId({ message: 'JobId không hợp lệ phải là mongoID' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'JobId không được để trống' })
  @IsMongoId({ message: 'JobId không hợp lệ phải là mongoID' })
  jobId: mongoose.Schema.Types.ObjectId;
}

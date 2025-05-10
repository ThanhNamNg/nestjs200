import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>; ////tạo kiểu dữ liệu cho company(document của mongoose giống như bảng trong sql)
//CompanyDocument = document MongoDB của Company, có đầy đủ các thuộc tính của Company và các method của Mongoose (save(), toObject(), populate(), v.v).

@Schema({ timestamps: true })
export class Company {
  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  address: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  logo: string;

  @Prop({ type: Object, required: false })
  createdBy: {
    _id: string;
    email: string;
  };

  @Prop({ type: Object, required: false })
  updatedBy: {
    _id: string;
    email: string;
  };

  @Prop({ type: Object, required: false })
  deletedBy: {
    _id: string;
    email: string;
  };

  @Prop({ type: String, required: false })
  createdAt: Date;

  @Prop({ type: String, required: false })
  updatedAt: Date;

  @Prop({ type: String, required: false })
  isDeleted: boolean;

  @Prop({ type: String, required: false })
  deletedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company); //tạo schema.
//NestJS cần schema này để kết nối với MongoDB qua Mongoose

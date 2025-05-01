import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>; ////tạo kiểu dữ liệu cho company(document của mongoose giống như bảng trong sql)

@Schema({ timestamps: true })
export class Company {
  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  address: string;

  @Prop({ type: String, required: false })
  desrciption: string;

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

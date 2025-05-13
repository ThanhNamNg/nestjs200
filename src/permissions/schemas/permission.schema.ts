import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>; ////tạo kiểu dữ liệu cho Permission(document của mongoose giống như bảng trong sql)
//PermissionDocument = document MongoDB của Permission, có đầy đủ các thuộc tính của Permission và các method của Mongoose (save(), toObject(), populate(), v.v).

@Schema({ timestamps: true })
export class Permission {
  @Prop()
  name: string;

  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;

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

export const PermissionSchema = SchemaFactory.createForClass(Permission); //tạo schema.
//NestJS cần schema này để kết nối với MongoDB qua Mongoose

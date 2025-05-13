import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>; //tạo kiểu dữ liệu cho user(document của mongoose giống như bảng trong sql)

@Schema({ timestamps: true })
// Tự động thêm trường createdAt và updatedAt vào tài liệu khi bạn lưu vào MongoDB.

// MongoDB sẽ quản lý tự động thời gian cho các trường này mà bạn không cần phải làm thủ công.
export class User {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken: string;

  @Prop({ type: Object, required: false })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object, required: false })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object, required: false })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
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

export const UserSchema = SchemaFactory.createForClass(User); //tạo schema.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>; //tạo kiểu dữ liệu cho user(document của mongoose giống như bảng trong sql)

@Schema({ timestamps: true })
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

  @Prop()
  role: string;

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

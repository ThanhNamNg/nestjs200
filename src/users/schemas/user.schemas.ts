
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>; //tạo kiểu dữ liệu cho user(document của mongoose giống như bảng trong sql)

@Schema({timestamps: true})
export class User {
  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  age: number;

  @Prop()
  adress: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

   @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User); //tạo schema.

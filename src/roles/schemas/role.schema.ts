import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

import { Permission } from 'src/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>; ////tạo kiểu dữ liệu cho Role(document của mongoose giống như bảng trong sql)
//RoleDocument = document MongoDB của Role, có đầy đủ các thuộc tính của Role và các method của Mongoose (save(), toObject(), populate(), v.v).

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: mongoose.Schema.Types.ObjectId[];

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

export const RoleSchema = SchemaFactory.createForClass(Role); //tạo schema.
//NestJS cần schema này để kết nối với MongoDB qua Mongoose

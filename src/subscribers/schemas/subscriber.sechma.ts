import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

import { Permission } from 'src/permissions/schemas/permission.schema';

export type subscriberDocument = HydratedDocument<Subscriber>; ////tạo kiểu dữ liệu chosubscriber(document của mongoose giống như bảng trong sql)
//SubscriberDocument = document MongoDB củasubscriber, có đầy đủ các thuộc tính củasubscriber và các method của Mongoose (save(), toObject(), populate(), v.v).

@Schema({ timestamps: true })
export class Subscriber {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  skills: string[];

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

export const subscriberSchema = SchemaFactory.createForClass(Subscriber); //tạo schema.
//NestJS cần schema này để kết nối với MongoDB qua Mongoose

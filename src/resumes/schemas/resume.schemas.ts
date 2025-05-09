import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>; ////tạo kiểu dữ liệu cho Resume(document của mongoose giống như bảng trong sql)
//ResumeDocument = document MongoDB của Resume, có đầy đủ các thuộc tính của Resume và các method của Mongoose (save(), toObject(), populate(), v.v).

export interface HistoryItem {
  status: string;
  updatedAt: Date;
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

@Schema({ timestamps: true })
export class Resume {
  @Prop()
  email: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  url: string;

  @Prop()
  status: string;

  @Prop()
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop()
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [Object] })
  history: HistoryItem;

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

export const ResumeSchema = SchemaFactory.createForClass(Resume); //tạo schema.
//NestJS cần schema này để kết nối với MongoDB qua Mongoose

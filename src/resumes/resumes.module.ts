import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './schemas/resume.schemas';
@Module({
  controllers: [ResumesController],
  providers: [ResumesService],
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]), // Import MongooseModule with Resume model
  ], // Import MongooseModule with Resume model
})
export class ResumesModule {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import * as validator from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {}

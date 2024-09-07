// src/step-count/dto/update-step-count.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateStepCountDto } from './create-step-count.dto';

export class UpdateStepCountDto extends PartialType(CreateStepCountDto) {}

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class ExerciseDto {
  @IsNotEmpty()
  exerciseId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  repetitions: string;

  @IsNotEmpty()
  @IsNumber()
  caloriesBurned: number;
}

export class CreateCustomProgramExerciceDto {
  @IsNotEmpty()
  @IsString()
  programName: string;

  @IsNotEmpty()
  @IsNumber()
  durationMonths: number;

  @IsNotEmpty()
  @IsNumber()
  sessionsPerWeek: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}

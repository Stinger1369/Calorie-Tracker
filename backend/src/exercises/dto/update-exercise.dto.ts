import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  readonly exerciseName?: string;

  @IsOptional()
  @IsNumber()
  readonly duration?: number;

  @IsOptional()
  @IsNumber()
  readonly caloriesBurned?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly date?: Date;
}

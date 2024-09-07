import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly exerciseName: string;

  @IsNotEmpty()
  @IsNumber()
  readonly duration: number;

  @IsOptional()
  @IsNumber()
  readonly caloriesBurned?: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly date: Date;
}

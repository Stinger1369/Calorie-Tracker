import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

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
  readonly date?: Date;
}

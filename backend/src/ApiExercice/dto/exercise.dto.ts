import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly imageUrl?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly instructions?: string;

  @IsOptional()
  @IsString()
  readonly trainingTips?: string;

  @IsOptional()
  @IsString()
  readonly muscleGroup?: string;

  @IsOptional()
  @IsNumber()
  readonly calories?: number;
}

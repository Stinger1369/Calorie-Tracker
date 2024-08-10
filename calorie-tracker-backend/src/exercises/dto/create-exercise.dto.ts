import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

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

  @IsNotEmpty()
  @IsNumber()
  readonly caloriesBurned: number;

  @IsNotEmpty()
  @IsDate()
  readonly date: Date;
}

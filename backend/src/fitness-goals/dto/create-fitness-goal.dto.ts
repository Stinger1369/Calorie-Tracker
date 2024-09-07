import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateFitnessGoalDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly foodName: string;

  @IsNotEmpty()
  @IsNumber()
  readonly calories: number;

  @IsNotEmpty()
  @IsNumber()
  readonly fat: number;

  @IsNotEmpty()
  @IsNumber()
  readonly sugar: number;

  @IsNotEmpty()
  @IsNumber()
  readonly protein: number;

  @IsNotEmpty()
  @IsDate()
  readonly date: Date;
}

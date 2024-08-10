import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

export class FoodAnalysisDto {
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

  @IsOptional()
  @IsString()
  readonly imageUrl?: string;
}

import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecommendationFoodDto {
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @IsString()
  Title: string;

  @IsString()
  Ingredients: string;

  @IsString()
  Instructions: string;

  @IsString()
  Season: string;

  @IsString()
  CleanedIngredients: string;

  @IsNumber()
  EstimatedCalories: number;

  @IsArray()
  @Type(() => String)
  ExtractedIngredients: string[];

  @IsString()
  ImageName: string;
}

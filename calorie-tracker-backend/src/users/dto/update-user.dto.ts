import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsDate,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BloodTestResultDto } from './blood-test-result.dto';
import { FoodAnalysisDto } from './food-analysis.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value.trim() : null))
  readonly gender?: string;

  @IsOptional()
  @IsNumber()
  readonly weight?: number;

  @IsOptional()
  @IsNumber()
  readonly height?: number;

  @IsOptional()
  @IsString()
  readonly maritalStatus?: string;

  @IsOptional()
  @IsNumber()
  readonly numberOfChildren?: number;

  @IsOptional()
  @IsString()
  readonly occupation?: string;

  @IsOptional()
  @IsString()
  readonly activityLevel?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly medicalConditions?: string[];

  @IsOptional()
  @IsNumber()
  readonly dailyCalorieIntake?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly dailyExercise?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BloodTestResultDto)
  readonly bloodTestResults?: BloodTestResultDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FoodAnalysisDto)
  readonly foodAnalyses?: FoodAnalysisDto[];

  @IsOptional()
  @IsString()
  readonly stressLevel?: string;

  @IsOptional()
  @IsNumber()
  readonly sleepDuration?: number;

  @IsOptional()
  @IsNumber()
  readonly waterIntake?: number;

  @IsOptional()
  @IsString()
  readonly alcoholConsumption?: string;

  @IsOptional()
  @IsString()
  readonly smokingHabits?: string;

  @IsOptional()
  @IsString()
  readonly dietaryPreferences?: string;

  @IsOptional()
  @IsNumber()
  readonly dailyStepCount?: number;

  @IsOptional()
  @IsNumber()
  readonly dailyActiveMinutes?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly foodAllergies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly medications?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly supplements?: string[];

  @IsOptional()
  @IsString()
  readonly ethnicity?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  readonly address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @IsOptional()
  @IsString()
  readonly livingEnvironment?: string;

  @IsOptional()
  @IsString()
  readonly fitnessGoals?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly hobbies?: string[];

  @IsOptional()
  @IsString()
  readonly mentalHealthStatus?: string;

  @IsOptional()
  @IsBoolean()
  readonly premiumUser?: boolean;

  @IsOptional()
  @IsString()
  readonly verificationCode?: string;

  @IsOptional()
  @IsBoolean()
  readonly isVerified?: boolean;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly imageUrl?: string;
}

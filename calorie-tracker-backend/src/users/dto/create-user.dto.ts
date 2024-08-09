import { BloodTestResultDto } from './blood-test-result.dto';
import { FoodAnalysisDto } from './food-analysis.dto';

export class CreateUserDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly dateOfBirth?: Date;
  readonly gender?: string;
  readonly weight?: number;
  readonly height?: number;
  readonly maritalStatus?: string;
  readonly numberOfChildren?: number;
  readonly occupation?: string;
  readonly activityLevel?: string;
  readonly medicalConditions?: string[];
  readonly dailyCalorieIntake?: number;
  readonly dailyExercise?: string;
  readonly bloodTestResults?: BloodTestResultDto[];
  readonly foodAnalyses?: FoodAnalysisDto[];
  readonly stressLevel?: string;
  readonly sleepDuration?: number;
  readonly waterIntake?: number;
  readonly alcoholConsumption?: string;
  readonly smokingHabits?: string;
  readonly dietaryPreferences?: string;
  readonly dailyStepCount?: number;
  readonly dailyActiveMinutes?: number;
  readonly foodAllergies?: string[];
  readonly medications?: string[];
  readonly supplements?: string[];
  readonly ethnicity?: string;
  readonly address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  readonly livingEnvironment?: string;
  readonly fitnessGoals?: string;
  readonly hobbies?: string[];
  readonly mentalHealthStatus?: string;
  readonly premiumUser?: boolean;
}

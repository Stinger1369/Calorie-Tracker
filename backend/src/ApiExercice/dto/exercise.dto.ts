import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';

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

  @IsOptional()
  @IsObject()
  readonly Insuffisant_Reps?: {
    repetitions: string;
    calories_depensée: {
      male: number;
      female: number;
      other: number;
    };
    calories_depense_repetition: {
      male: number;
      female: number;
      other: number;
    };
  };

  @IsOptional()
  @IsObject()
  readonly Normal_Reps?: {
    repetitions: string;
    calories_depensée: {
      male: number;
      female: number;
      other: number;
    };
    calories_depense_repetition: {
      male: number;
      female: number;
      other: number;
    };
  };

  @IsOptional()
  @IsObject()
  readonly Surpoids_Reps?: {
    repetitions: string;
    calories_depensée: {
      male: number;
      female: number;
      other: number;
    };
    calories_depense_repetition: {
      male: number;
      female: number;
      other: number;
    };
  };

  @IsOptional()
  @IsObject()
  readonly Obese_Reps?: {
    repetitions: string;
    calories_depensée: {
      male: number;
      female: number;
      other: number;
    };
    calories_depense_repetition: {
      male: number;
      female: number;
      other: number;
    };
  };

  @IsOptional()
  @IsObject()
  readonly like?: {
    user_ids: {
      male: string[];
      female: string[];
      other: string[];
    };
    count: {
      male: number;
      female: number;
      other: number;
    };
  };

  @IsOptional()
  @IsObject()
  readonly unlike?: {
    user_ids: {
      male: string[];
      female: string[];
      other: string[];
    };
    count: {
      male: number;
      female: number;
      other: number;
    };
  };
}

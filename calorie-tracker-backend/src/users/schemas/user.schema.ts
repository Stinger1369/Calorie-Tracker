import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class BloodTestResult extends Document {
  @Prop({ required: true })
  cholesterol: number;

  @Prop({ required: true })
  bloodSugar: number;

  @Prop({ required: true })
  hemoglobin: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  scanUrl: string; // URL or path to the scanned blood test result
}

export const BloodTestResultSchema =
  SchemaFactory.createForClass(BloodTestResult);

@Schema()
export class FoodAnalysis extends Document {
  @Prop({ required: true })
  foodName: string;

  @Prop({ required: true })
  calories: number;

  @Prop({ required: true })
  fat: number;

  @Prop({ required: true })
  sugar: number;

  @Prop({ required: true })
  protein: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  imageUrl: string; // URL or path to the image of the food
}

export const FoodAnalysisSchema = SchemaFactory.createForClass(FoodAnalysis);

@Schema()
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  dateOfBirth: Date;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  verificationCode: string;

  @Prop()
  codeExpiration: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop()
  weight: number;

  @Prop()
  height: number;

  @Prop()
  maritalStatus: string; // Single, Married, etc.

  @Prop()
  numberOfChildren: number;

  @Prop()
  occupation: string; // e.g., Plumber, IT professional

  @Prop()
  activityLevel: string; // Sedentary, Lightly active, etc.

  @Prop([String])
  medicalConditions: string[];

  @Prop({ required: false })
  zodiacSign: string;

  @Prop()
  dailyCalorieIntake: number;

  @Prop([String])
  dailyExercise: string[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'BloodTestResult' }])
  bloodTestResults: BloodTestResult[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'FoodAnalysis' }])
  foodAnalyses: FoodAnalysis[];

  @Prop()
  stressLevel: string; // Low, Moderate, High

  @Prop()
  sleepDuration: number; // Hours of sleep per night

  @Prop()
  waterIntake: number; // Liters per day

  @Prop()
  alcoholConsumption: string; // None, Occasional, Regular

  @Prop()
  smokingHabits: string; // Non-smoker, Former smoker, Smoker

  @Prop()
  dietaryPreferences: string; // Vegetarian, Vegan, etc.

  @Prop()
  dailyStepCount: number; // Number of steps per day

  @Prop()
  dailyActiveMinutes: number; // Active minutes per day

  @Prop([String])
  foodAllergies: string[]; // List of food allergies

  @Prop([String])
  medications: string[]; // List of medications

  @Prop([String])
  supplements: string[]; // List of supplements

  @Prop()
  ethnicity: string; // African, American, European, etc.

  @Prop({
    type: Object,
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
  })
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @Prop()
  livingEnvironment: string; // Desert, Urban, Rural, etc.

  @Prop()
  fitnessGoals: string; // Weight loss, Muscle gain, etc.

  @Prop([String])
  hobbies: string[]; // List of hobbies

  @Prop()
  mentalHealthStatus: string; // Good, Moderate, Poor

  @Prop()
  bmi: number; // IMC (Indice de Masse Corporelle)

  @Prop()
  recommendedCalories: number; // Calorie quotidienne recommandée

  @Prop()
  caloricNeeds: number; // Besoins caloriques calculés

  @Prop()
  healthAssessment: string; // Bilan de santé résumé

  @Prop()
  premiumUser: boolean; // Indicates if the user has a premium account

  @Prop()
  horoscope: string; // Calculated based on dateOfBirth

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

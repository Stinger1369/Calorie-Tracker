import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FitnessExercise extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  description?: string;

  @Prop()
  instructions?: string;

  @Prop()
  trainingTips?: string;

  @Prop()
  muscleGroup?: string;

  @Prop()
  calories?: number;

  @Prop({ type: Object })
  Insuffisant_Reps?: {
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

  @Prop({ type: Object })
  Normal_Reps?: {
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

  @Prop({ type: Object })
  Surpoids_Reps?: {
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

  @Prop({ type: Object })
  Obese_Reps?: {
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

  @Prop({
    type: Object,
    default: {
      user_ids: { male: [], female: [], other: [] },
      count: { male: 0, female: 0, other: 0 },
    },
  })
  like?: {
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

  @Prop({
    type: Object,
    default: {
      user_ids: { male: [], female: [], other: [] },
      count: { male: 0, female: 0, other: 0 },
    },
  })
  unlike?: {
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

export const FitnessExerciseSchema =
  SchemaFactory.createForClass(FitnessExercise);

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
  calories_depensée?: {
    Homme: number;
    Femme: number;
    Autres: number;
  };

  @Prop({ type: Object })
  calories_depense_repetition?: {
    Homme: number;
    Femme: number;
    Autres: number;
  };
}

export const FitnessExerciseSchema =
  SchemaFactory.createForClass(FitnessExercise);

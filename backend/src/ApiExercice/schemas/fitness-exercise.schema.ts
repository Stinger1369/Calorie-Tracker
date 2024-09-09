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
}

export const FitnessExerciseSchema =
  SchemaFactory.createForClass(FitnessExercise);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Exercise extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  exerciseName: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: false })
  caloriesBurned?: number;

  @Prop({ required: true })
  date: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

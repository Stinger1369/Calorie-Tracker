import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class FitnessGoal extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  goalName: string;

  @Prop({ required: true })
  target: number;

  @Prop({ required: true })
  progress: number;

  @Prop({ required: true })
  date: Date;
}

export const FitnessGoalSchema = SchemaFactory.createForClass(FitnessGoal);

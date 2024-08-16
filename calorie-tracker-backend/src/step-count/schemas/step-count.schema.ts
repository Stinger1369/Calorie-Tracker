// src/step-count/schemas/step-count.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StepCountDocument = StepCount & Document;

@Schema()
export class StepCount extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  steps: number;
}

export const StepCountSchema = SchemaFactory.createForClass(StepCount);

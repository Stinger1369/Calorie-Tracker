import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CustomProgramsExercice extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  programName: string;

  @Prop({ required: true })
  durationMonths: number;

  @Prop({ required: true })
  sessionsPerWeek: number;

  @Prop([
    {
      exerciseId: { type: Types.ObjectId, ref: 'Exercice' },
      type: { type: String, required: true },
      repetitions: { type: String, required: true },
      caloriesBurned: { type: Number, required: true },
    },
  ])
  exercises: Array<{
    exerciseId: Types.ObjectId;
    type: string;
    repetitions: string;
    caloriesBurned: number;
  }>;
}

export const CustomProgramsExerciceSchema = SchemaFactory.createForClass(
  CustomProgramsExercice,
);

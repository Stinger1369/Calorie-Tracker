import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class FoodConsumption extends Document {
  @Prop({ required: true })
  userId: string;

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
}

export const FoodConsumptionSchema =
  SchemaFactory.createForClass(FoodConsumption);

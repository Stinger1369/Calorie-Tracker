import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecommendationFoodDocument = RecommendationFood & Document;

@Schema()
export class RecommendationFood {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  Ingredients: string;

  @Prop({ required: true })
  Instructions: string;

  @Prop({ required: true })
  Season: string;

  @Prop({ required: true })
  CleanedIngredients: string;

  @Prop({ required: true })
  EstimatedCalories: number;

  @Prop({ type: [String], required: true })
  ExtractedIngredients: string[];

  @Prop({ required: true })
  ImageName: string;
}

export const RecommendationFoodSchema =
  SchemaFactory.createForClass(RecommendationFood);

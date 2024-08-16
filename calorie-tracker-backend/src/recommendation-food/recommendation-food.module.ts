import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationFoodService } from './recommendation-food.service';
import { RecommendationFoodController } from './recommendation-food.controller';
import {
  RecommendationFood,
  RecommendationFoodSchema,
} from './schemas/recommendation-food.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecommendationFood.name, schema: RecommendationFoodSchema },
    ]),
  ],
  controllers: [RecommendationFoodController],
  providers: [RecommendationFoodService],
})
export class RecommendationFoodModule {}

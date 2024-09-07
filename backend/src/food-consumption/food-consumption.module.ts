import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodConsumptionService } from './food-consumption.service';
import { FoodConsumptionController } from './food-consumption.controller';
import {
  FoodConsumption,
  FoodConsumptionSchema,
} from './schemas/food-consumption.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FoodConsumption.name, schema: FoodConsumptionSchema },
    ]),
  ],
  controllers: [FoodConsumptionController],
  providers: [FoodConsumptionService],
})
export class FoodConsumptionModule {}

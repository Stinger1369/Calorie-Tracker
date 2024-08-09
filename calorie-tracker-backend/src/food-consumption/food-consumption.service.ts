import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FoodConsumption } from './schemas/food-consumption.schema';
import { CreateFoodConsumptionDto } from './dto/create-food-consumption.dto';

@Injectable()
export class FoodConsumptionService {
  constructor(
    @InjectModel(FoodConsumption.name)
    private foodConsumptionModel: Model<FoodConsumption>,
  ) {}

  async create(
    createFoodConsumptionDto: CreateFoodConsumptionDto,
  ): Promise<FoodConsumption> {
    const foodConsumption = new this.foodConsumptionModel(
      createFoodConsumptionDto,
    );
    return foodConsumption.save();
  }

  async findAll(): Promise<FoodConsumption[]> {
    return this.foodConsumptionModel.find().exec();
  }

  async findByUserId(userId: string): Promise<FoodConsumption[]> {
    return this.foodConsumptionModel.find({ userId }).exec();
  }

  async delete(id: string): Promise<FoodConsumption> {
    return this.foodConsumptionModel.findByIdAndDelete(id).exec();
  }
}

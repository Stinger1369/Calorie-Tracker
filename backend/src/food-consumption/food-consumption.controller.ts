import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FoodConsumptionService } from './food-consumption.service';
import { CreateFoodConsumptionDto } from './dto/create-food-consumption.dto';
import { FoodConsumption } from './schemas/food-consumption.schema';

@Controller('food-consumption')
export class FoodConsumptionController {
  constructor(
    private readonly foodConsumptionService: FoodConsumptionService,
  ) {}

  @Post()
  async create(
    @Body() createFoodConsumptionDto: CreateFoodConsumptionDto,
  ): Promise<FoodConsumption> {
    return this.foodConsumptionService.create(createFoodConsumptionDto);
  }

  @Get()
  async findAll(): Promise<FoodConsumption[]> {
    return this.foodConsumptionService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<FoodConsumption[]> {
    return this.foodConsumptionService.findByUserId(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<FoodConsumption> {
    return this.foodConsumptionService.delete(id);
  }
}

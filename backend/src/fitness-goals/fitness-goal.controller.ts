import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FitnessGoalService } from './fitness-goal.service';
import { CreateFitnessGoalDto } from './dto/create-fitness-goal.dto';
import { FitnessGoal } from './schemas/fitness-goal.schema';

@Controller('fitness-goals')
export class FitnessGoalController {
  constructor(private readonly fitnessGoalService: FitnessGoalService) {}

  @Post()
  async create(
    @Body() createFitnessGoalDto: CreateFitnessGoalDto,
  ): Promise<FitnessGoal> {
    return this.fitnessGoalService.create(createFitnessGoalDto);
  }

  @Get()
  async findAll(): Promise<FitnessGoal[]> {
    return this.fitnessGoalService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<FitnessGoal[]> {
    return this.fitnessGoalService.findByUserId(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<FitnessGoal> {
    return this.fitnessGoalService.delete(id);
  }
}

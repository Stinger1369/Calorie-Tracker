import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Exercise } from './schemas/exercise.schema';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.create(createExerciseDto);
  }

  @Get()
  async findAll(): Promise<Exercise[]> {
    return this.exerciseService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Exercise[]> {
    return this.exerciseService.findByUserId(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Exercise> {
    return this.exerciseService.delete(id);
  }
}

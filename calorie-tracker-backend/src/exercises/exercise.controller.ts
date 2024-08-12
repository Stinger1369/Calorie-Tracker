import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './schemas/exercise.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.create(createExerciseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.update(id, updateExerciseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Exercise[]> {
    return this.exerciseService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Exercise[]> {
    return this.exerciseService.findByUserId(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Exercise> {
    return this.exerciseService.delete(id);
  }
}

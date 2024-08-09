import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise } from './schemas/exercise.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = new this.exerciseModel(createExerciseDto);
    return exercise.save();
  }

  async findAll(): Promise<Exercise[]> {
    return this.exerciseModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Exercise[]> {
    return this.exerciseModel.find({ userId }).exec();
  }

  async delete(id: string): Promise<Exercise> {
    return this.exerciseModel.findByIdAndDelete(id).exec();
  }
}

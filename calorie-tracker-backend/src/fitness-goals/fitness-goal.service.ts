import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FitnessGoal } from './schemas/fitness-goal.schema';
import { CreateFitnessGoalDto } from './dto/create-fitness-goal.dto';

@Injectable()
export class FitnessGoalService {
  constructor(
    @InjectModel(FitnessGoal.name) private fitnessGoalModel: Model<FitnessGoal>,
  ) {}

  async create(
    createFitnessGoalDto: CreateFitnessGoalDto,
  ): Promise<FitnessGoal> {
    const fitnessGoal = new this.fitnessGoalModel(createFitnessGoalDto);
    return fitnessGoal.save();
  }

  async findAll(): Promise<FitnessGoal[]> {
    return this.fitnessGoalModel.find().exec();
  }

  async findByUserId(userId: string): Promise<FitnessGoal[]> {
    return this.fitnessGoalModel.find({ userId }).exec();
  }

  async delete(id: string): Promise<FitnessGoal> {
    return this.fitnessGoalModel.findByIdAndDelete(id).exec();
  }
}

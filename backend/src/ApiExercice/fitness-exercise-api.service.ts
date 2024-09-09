import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FitnessExercise } from './schemas/fitness-exercise.schema';

@Injectable()
export class FitnessExerciseApiService {
  constructor(
    @InjectModel(FitnessExercise.name)
    private readonly fitnessExerciseModel: Model<FitnessExercise>,
  ) {}

  // Méthode pour récupérer tous les exercices
  async getAllExercises(): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel.find().exec();
  }

  async getAllMuscleGroups(): Promise<string[]> {
    const muscleGroups = await this.fitnessExerciseModel
      .distinct('muscleGroup')
      .exec();
    return muscleGroups;
  }

  async getExercisesByMuscleGroup(
    muscleGroup: string,
  ): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({ muscleGroup: { $regex: muscleGroup, $options: 'i' } })
      .exec();
  }

  async getExercisesByTitle(title: string): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({ title: { $regex: title, $options: 'i' } })
      .exec();
  }

  async getExercisesByCalories(
    minCalories: number,
    maxCalories: number,
  ): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({ calories: { $gte: minCalories, $lte: maxCalories } })
      .exec();
  }

  async getExercisesByExactCalories(
    calories: number,
  ): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel.find({ calories }).exec();
  }

  async getExerciseById(id: string): Promise<FitnessExercise> {
    return this.fitnessExerciseModel.findById(id).exec();
  }

  async createExercise(
    fitnessExercise: FitnessExercise,
  ): Promise<FitnessExercise> {
    const newFitnessExercise = new this.fitnessExerciseModel(fitnessExercise);
    return newFitnessExercise.save();
  }

  async deleteExercise(id: string): Promise<FitnessExercise> {
    return this.fitnessExerciseModel.findByIdAndDelete(id).exec();
  }
}

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

  // Récupérer les exercices par groupe musculaire
  async getExercisesByMuscleGroup(
    muscleGroup: string,
  ): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({ muscleGroup: { $regex: muscleGroup, $options: 'i' } })
      .exec();
  }

  // Récupérer les exercices par titre
  async getExercisesByTitle(title: string): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({ title: { $regex: title, $options: 'i' } })
      .exec();
  }

  // Nouvelle méthode pour récupérer les exercices par groupe musculaire et titre
  async getExercisesByMuscleGroupAndTitle(
    muscleGroup: string,
    title: string,
  ): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({
        muscleGroup: { $regex: muscleGroup, $options: 'i' },
        title: { $regex: title, $options: 'i' },
      })
      .exec();
  }

  // Récupérer les exercices dans une plage de calories
  async getExercisesByCalories(
    minCalories: number,
    maxCalories: number,
  ): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({ calories: { $gte: minCalories, $lte: maxCalories } })
      .exec();
  }

  // Récupérer les exercices par type (e.g., Musculation, Cardio)
  async getExercisesByType(type: string): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({ Type_Exercice: { $regex: type, $options: 'i' } })
      .exec();
  }

  // Récupérer les exercices selon le type de répétition et la plage
  async getExercisesByReps(
    repsType: string,
    range: string,
  ): Promise<FitnessExercise[]> {
    return this.fitnessExerciseModel
      .find({ [`${repsType}.repetitions`]: { $regex: range, $options: 'i' } })
      .exec();
  }

  // Récupérer un exercice par ID
  async getExerciseById(id: string): Promise<FitnessExercise> {
    return this.fitnessExerciseModel.findById(id).exec();
  }
}

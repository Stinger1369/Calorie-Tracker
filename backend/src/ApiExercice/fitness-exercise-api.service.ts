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

  // Méthode pour gérer le like/unlike
  async toggleLikeOrUnlike(
    exerciseId: string,
    userId: string,
    actionType: 'like' | 'unlike',
    gender: 'male' | 'female' | 'other',
  ): Promise<FitnessExercise> {
    const exercise = await this.fitnessExerciseModel.findById(exerciseId);

    if (!exercise) {
      throw new Error('Exercice non trouvé');
    }

    // Initialiser les propriétés `like` et `unlike` si elles n'existent pas
    if (!exercise.like) {
      exercise.like = {
        user_ids: { male: [], female: [], other: [] },
        count: { male: 0, female: 0, other: 0 },
      };
    }

    if (!exercise.unlike) {
      exercise.unlike = {
        user_ids: { male: [], female: [], other: [] },
        count: { male: 0, female: 0, other: 0 },
      };
    }

    if (actionType === 'like') {
      // Supprimer l'utilisateur du tableau unlike s'il a déjà unliké
      if (exercise.unlike.user_ids[gender].includes(userId)) {
        exercise.unlike.user_ids[gender] = exercise.unlike.user_ids[
          gender
        ].filter((id) => id !== userId);
        exercise.unlike.count[gender] = exercise.unlike.user_ids[gender].length;
      }

      // Ajouter l'utilisateur au tableau like s'il n'y est pas déjà
      if (!exercise.like.user_ids[gender].includes(userId)) {
        exercise.like.user_ids[gender].push(userId);
        exercise.like.count[gender] = exercise.like.user_ids[gender].length;
      }
    } else if (actionType === 'unlike') {
      // Supprimer l'utilisateur du tableau like s'il a déjà liké
      if (exercise.like.user_ids[gender].includes(userId)) {
        exercise.like.user_ids[gender] = exercise.like.user_ids[gender].filter(
          (id) => id !== userId,
        );
        exercise.like.count[gender] = exercise.like.user_ids[gender].length;
      }

      // Ajouter l'utilisateur au tableau unlike s'il n'y est pas déjà
      if (!exercise.unlike.user_ids[gender].includes(userId)) {
        exercise.unlike.user_ids[gender].push(userId);
        exercise.unlike.count[gender] = exercise.unlike.user_ids[gender].length;
      }
    }

    // Sauvegarder l'exercice mis à jour
    await exercise.save();

    return exercise;
  }
}

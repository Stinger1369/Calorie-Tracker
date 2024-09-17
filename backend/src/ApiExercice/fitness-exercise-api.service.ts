import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FitnessExercise } from './schemas/fitness-exercise-api.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto'; // Importer le DTO pour créer un exercice
import { ToggleLikeDto } from './dto/toggle-like.dto'; // Importer le DTO pour like/unlike

@Injectable()
export class FitnessExerciseApiService {
  constructor(
    @InjectModel(FitnessExercise.name)
    private readonly fitnessExerciseModel: Model<FitnessExercise>,
  ) {}

  // Méthode pour créer un nouvel exercice
  async createExercise(
    createExerciseDto: CreateExerciseDto,
  ): Promise<FitnessExercise> {
    const newExercise = new this.fitnessExerciseModel(createExerciseDto);
    return newExercise.save();
  }

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

  // Récupérer les exercices par groupe musculaire et titre avec statut de like
  async getExercisesByMuscleGroupAndTitleWithLikeStatus(
    muscleGroup: string,
    title: string,
    userId: string,
    gender: string,
  ): Promise<any[]> {
    const exercises = await this.fitnessExerciseModel
      .find({
        muscleGroup: { $regex: muscleGroup, $options: 'i' },
        title: { $regex: title, $options: 'i' },
      })
      .exec();

    // Ajouter dynamiquement le statut `isLiked` pour chaque exercice
    return exercises.map((exercise) => {
      const isLiked = exercise.like.user_ids[gender]?.includes(userId) || false;
      return { ...exercise.toObject(), isLiked };
    });
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

  async getUniqueMuscleGroups(): Promise<string[]> {
    const exercises = await this.fitnessExerciseModel
      .find()
      .select('muscleGroup')
      .exec();

    const muscleGroups = exercises.map((exercise) => exercise.muscleGroup);

    // Filtrer les doublons et retourner les groupes musculaires uniques
    return [...new Set(muscleGroups)];
  }

  // Méthode pour gérer le like/unlike
  async toggleLikeOrUnlike(
    exerciseId: string,
    toggleLikeDto: ToggleLikeDto,
  ): Promise<any> {
    const { userId, actionType, gender } = toggleLikeDto;
    const exercise = await this.fitnessExerciseModel.findById(exerciseId);

    if (!exercise) {
      throw new Error('Exercice non trouvé');
    }

    console.log(
      `User ID: ${userId} is trying to ${actionType} exercise ID: ${exerciseId} for gender: ${gender}`,
    );

    try {
      if (actionType === 'like') {
        const isAlreadyLiked = exercise.like.user_ids[gender]?.includes(userId);

        if (!isAlreadyLiked) {
          console.log(
            `User ID: ${userId} has not liked this exercise yet. Proceeding to like it.`,
          );

          const isAlreadyUnliked =
            exercise.unlike.user_ids[gender]?.includes(userId);
          if (isAlreadyUnliked) {
            console.log(
              `User ID: ${userId} had unliked this exercise. Removing from unlikes.`,
            );
            await this.fitnessExerciseModel.findByIdAndUpdate(exerciseId, {
              $pull: { [`unlike.user_ids.${gender}`]: userId },
              $inc: { [`unlike.count.${gender}`]: -1 },
            });
          }

          await this.fitnessExerciseModel.findByIdAndUpdate(
            exerciseId,
            {
              $push: { [`like.user_ids.${gender}`]: userId },
              $inc: { [`like.count.${gender}`]: 1 },
            },
            { new: true },
          );

          console.log(
            `User ID: ${userId} successfully liked the exercise ID: ${exerciseId}`,
          );
        }
      } else if (actionType === 'unlike') {
        const isAlreadyUnliked =
          exercise.unlike.user_ids[gender]?.includes(userId);

        if (!isAlreadyUnliked) {
          console.log(
            `User ID: ${userId} has not unliked this exercise yet. Proceeding to unlike it.`,
          );

          const isAlreadyLiked =
            exercise.like.user_ids[gender]?.includes(userId);
          if (isAlreadyLiked) {
            console.log(
              `User ID: ${userId} had liked this exercise. Removing from likes.`,
            );
            await this.fitnessExerciseModel.findByIdAndUpdate(exerciseId, {
              $pull: { [`like.user_ids.${gender}`]: userId },
              $inc: { [`like.count.${gender}`]: -1 },
            });
          }

          await this.fitnessExerciseModel.findByIdAndUpdate(
            exerciseId,
            {
              $push: { [`unlike.user_ids.${gender}`]: userId },
              $inc: { [`unlike.count.${gender}`]: 1 },
            },
            { new: true },
          );

          console.log(
            `User ID: ${userId} successfully unliked the exercise ID: ${exerciseId}`,
          );
        }
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw new Error('Unable to update exercise');
    }

    const updatedExercise =
      await this.fitnessExerciseModel.findById(exerciseId);
    const isLiked =
      updatedExercise.like.user_ids[gender]?.includes(userId) || false;
    const isUnliked =
      updatedExercise.unlike.user_ids[gender]?.includes(userId) || false;

    console.log(
      `Updated status for exercise ID: ${exerciseId} - Liked: ${isLiked}, Unliked: ${isUnliked}`,
    );

    return {
      ...updatedExercise.toObject(),
      isLiked,
      isUnliked,
    };
  }

  // Méthode pour récupérer les exercices avec le statut de like pour un utilisateur
  async getExerciseWithLikeStatus(
    exerciseId: string,
    userId: string,
    gender: string,
  ): Promise<{ isLiked: boolean; isUnliked: boolean }> {
    const exercise = await this.fitnessExerciseModel
      .findById(exerciseId)
      .exec();

    if (!exercise) {
      throw new Error('Exercice non trouvé');
    }

    // Ajout d'une séparation visuelle dans les logs
    console.log('-------------------------------------------');
    console.log(`Exercise ID: ${exerciseId}`);

    // Log détaillé pour voir les données actuelles
    console.log('Checking like/unlike status for exercise:', exercise);
    console.log('User IDs in like:', exercise.like?.user_ids?.[gender]);
    console.log('User IDs in unlike:', exercise.unlike?.user_ids?.[gender]);
    console.log('Gender being checked:', gender);

    console.log('like.user_ids:', exercise.like?.user_ids);
    console.log('unlike.user_ids:', exercise.unlike?.user_ids);

    const isLiked =
      exercise.like?.user_ids?.male?.includes(userId) ||
      exercise.like?.user_ids?.female?.includes(userId) ||
      exercise.like?.user_ids?.other?.includes(userId) ||
      false;

    const isUnliked =
      exercise.unlike?.user_ids?.male?.includes(userId) ||
      exercise.unlike?.user_ids?.female?.includes(userId) ||
      exercise.unlike?.user_ids?.other?.includes(userId) ||
      false;

    // Retourner les statuts isLiked et isUnliked
    console.log(
      `User ID: ${userId} checking status for exercise ID: ${exerciseId} - Liked: ${isLiked}, Unliked: ${isUnliked}`,
    );
    console.log('-------------------------------------------');

    return { isLiked, isUnliked };
  }
}

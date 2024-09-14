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

  // Nouvelle méthode pour récupérer les exercices par groupe musculaire, titre et statut de like
  // Nouvelle méthode pour récupérer les exercices par groupe musculaire, titre et statut de like
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

  // Méthode pour gérer le like/unlike
  async toggleLikeOrUnlike(
    exerciseId: string,
    toggleLikeDto: ToggleLikeDto, // Utilisation du DTO pour valider les données
  ): Promise<FitnessExercise> {
    const { userId, actionType, gender } = toggleLikeDto;
    const exercise = await this.fitnessExerciseModel.findById(exerciseId);

    if (!exercise) {
      throw new Error('Exercice non trouvé');
    }

    try {
      if (actionType === 'like') {
        await this.fitnessExerciseModel.findByIdAndUpdate(
          exerciseId,
          {
            $pull: { [`unlike.user_ids.${gender}`]: userId }, // Retirer de la liste unlike
            $push: { [`like.user_ids.${gender}`]: userId }, // Ajouter à la liste like
            $inc: {
              [`unlike.count.${gender}`]: -1, // Diminuer le count unlike
              [`like.count.${gender}`]: 1, // Incrémenter le count like
            },
          },
          { new: true }, // Pour retourner l'objet mis à jour
        );
      } else if (actionType === 'unlike') {
        await this.fitnessExerciseModel.findByIdAndUpdate(
          exerciseId,
          {
            $pull: { [`like.user_ids.${gender}`]: userId }, // Retirer de la liste like
            $push: { [`unlike.user_ids.${gender}`]: userId }, // Ajouter à la liste unlike
            $inc: {
              [`like.count.${gender}`]: -1, // Diminuer le count like
              [`unlike.count.${gender}`]: 1, // Incrémenter le count unlike
            },
          },
          { new: true }, // Pour retourner l'objet mis à jour
        );
      }
      console.log('Exercise updated successfully');
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw new Error('Unable to update exercise');
    }

    return this.fitnessExerciseModel.findById(exerciseId);
  }

  // Méthode pour récupérer les exercices avec le statut de like pour un utilisateur
  async getExercisesWithLikeStatus(
    userId: string,
    gender: string,
  ): Promise<any[]> {
    const exercises = await this.fitnessExerciseModel.find().exec();

    // Check if the user has liked each exercise based on the gender
    return exercises.map((exercise) => {
      const isLiked = exercise.like.user_ids[gender]?.includes(userId) || false;
      return { ...exercise.toObject(), isLiked };
    });
  }
}

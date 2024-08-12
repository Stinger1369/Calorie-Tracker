import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise } from './schemas/exercise.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    // Vérifiez si un exercice similaire existe déjà
    const existingExercise = await this.exerciseModel.findOne({
      userId: createExerciseDto.userId,
      exerciseName: createExerciseDto.exerciseName,
      date: createExerciseDto.date,
    });

    if (existingExercise && typeof existingExercise._id === 'string') {
      // Si un exercice similaire existe et l'identifiant est une chaîne de caractères, mettez-le à jour
      return this.update(existingExercise._id as string, createExerciseDto);
    }

    // Sinon, créez un nouvel exercice
    const exercise = new this.exerciseModel(createExerciseDto);
    return exercise.save();
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    if (typeof id !== 'string') {
      throw new Error('Invalid ID type');
    }
    return this.exerciseModel
      .findByIdAndUpdate(id, updateExerciseDto, { new: true })
      .exec();
  }

  async findAll(): Promise<Exercise[]> {
    return this.exerciseModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Exercise[]> {
    return this.exerciseModel.find({ userId }).exec();
  }

  async delete(id: string): Promise<Exercise> {
    if (typeof id !== 'string') {
      throw new Error('Invalid ID type');
    }
    return this.exerciseModel.findByIdAndDelete(id).exec();
  }
}

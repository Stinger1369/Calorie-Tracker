import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise } from './schemas/exercise.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    private readonly usersService: UsersService, // Injection du UsersService
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    // Vérifiez si un exercice similaire existe déjà
    const existingExercise = await this.exerciseModel.findOne({
      userId: createExerciseDto.userId,
      exerciseName: createExerciseDto.exerciseName,
      date: createExerciseDto.date,
    });

    let savedExercise;
    if (existingExercise && typeof existingExercise._id === 'string') {
      // Si un exercice similaire existe, mettez-le à jour
      savedExercise = await this.update(
        existingExercise._id as string,
        createExerciseDto,
      );
    } else {
      // Sinon, créez un nouvel exercice
      const exercise = new this.exerciseModel(createExerciseDto);
      savedExercise = await exercise.save();
    }

    // Mise à jour du champ dailyExercise de l'utilisateur
    await this.usersService.updateDailyExercise(
      createExerciseDto.userId,
      createExerciseDto.exerciseName,
    );

    return savedExercise;
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    if (typeof id !== 'string') {
      throw new Error('Invalid ID type');
    }

    const updatedExercise = await this.exerciseModel
      .findByIdAndUpdate(id, updateExerciseDto, { new: true })
      .exec();

    // Mise à jour du champ dailyExercise de l'utilisateur après modification de l'exercice
    await this.usersService.updateDailyExercise(
      updatedExercise.userId,
      updateExerciseDto.exerciseName,
    );

    return updatedExercise;
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

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { Exercise, ExerciseSchema } from './schemas/exercise.schema';
import { UsersModule } from '../users/users.module'; // Importez UsersModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
    UsersModule, // Ajoutez UsersModule ici
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}

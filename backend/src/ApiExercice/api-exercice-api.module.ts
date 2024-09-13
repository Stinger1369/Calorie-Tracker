import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FitnessExerciseApiController } from './fitness-exercise-api.controller';
import { FitnessExerciseApiService } from './fitness-exercise-api.service';
import {
  FitnessExercise,
  FitnessExerciseSchema,
} from './schemas/fitness-exercise-api.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FitnessExercise.name,
        schema: FitnessExerciseSchema,
        collection: 'fitnessexercice',
      },
    ]),
  ],
  controllers: [FitnessExerciseApiController],
  providers: [FitnessExerciseApiService],
})
export class FitnessExerciseModule {}

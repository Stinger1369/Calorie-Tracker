import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExerciseApiService } from './exercise-api.service';
import { ExerciseApiController } from './exercise-api.controller';

@Module({
  imports: [HttpModule], // Utilisez HttpModule ici
  controllers: [ExerciseApiController],
  providers: [ExerciseApiService],
})
export class ApiExerciceModule {}

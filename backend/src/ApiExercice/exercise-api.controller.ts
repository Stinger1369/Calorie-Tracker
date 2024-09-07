import { Controller, Get } from '@nestjs/common';
import { ExerciseApiService } from './exercise-api.service';

@Controller('api-exercises')
export class ExerciseApiController {
  constructor(private readonly exerciseApiService: ExerciseApiService) {}

  @Get()
  async getExternalExercises() {
    return this.exerciseApiService.getExercises();
  }
}

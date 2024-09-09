import { Controller, Get, Param, Query } from '@nestjs/common';
import { FitnessExerciseApiService } from './fitness-exercise-api.service';

@Controller('fitnessExercice')
export class FitnessExerciseApiController {
  constructor(
    private readonly fitnessExerciseApiService: FitnessExerciseApiService,
  ) {}

  // Route pour récupérer tous les exercices
  @Get()
  async getAllExercises() {
    return this.fitnessExerciseApiService.getAllExercises();
  }

  // Route pour obtenir tous les groupes musculaires uniques
  @Get('muscleGroups')
  async getAllMuscleGroups() {
    return this.fitnessExerciseApiService.getAllMuscleGroups();
  }

  @Get('muscleGroup/:muscleGroup')
  async getExercisesByMuscleGroup(@Param('muscleGroup') muscleGroup: string) {
    return this.fitnessExerciseApiService.getExercisesByMuscleGroup(
      muscleGroup,
    );
  }

  @Get('title/:title')
  async getExercisesByTitle(@Param('title') title: string) {
    return this.fitnessExerciseApiService.getExercisesByTitle(title);
  }

  @Get('calories')
  async getExercisesByCalories(
    @Query('min') minCalories: number,
    @Query('max') maxCalories: number,
  ) {
    return this.fitnessExerciseApiService.getExercisesByCalories(
      minCalories,
      maxCalories,
    );
  }

  @Get('calories/:calories')
  async getExercisesByExactCalories(@Param('calories') calories: number) {
    return this.fitnessExerciseApiService.getExercisesByExactCalories(calories);
  }

  @Get(':id')
  async getExerciseById(@Param('id') id: string) {
    return this.fitnessExerciseApiService.getExerciseById(id);
  }
}

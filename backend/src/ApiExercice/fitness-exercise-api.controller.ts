import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Post,
  Body,
} from '@nestjs/common';
import { FitnessExerciseApiService } from './fitness-exercise-api.service';
import { CreateExerciseDto } from './dto/create-exercise.dto'; // Importer le DTO
import { ToggleLikeDto } from './dto/toggle-like.dto';

@Controller('fitnessexercice')
export class FitnessExerciseApiController {
  constructor(
    private readonly fitnessExerciseApiService: FitnessExerciseApiService,
  ) {}

  // Route pour récupérer tous les exercices
  @Get()
  async getAllExercises() {
    return this.fitnessExerciseApiService.getAllExercises();
  }

  // Route pour créer un nouvel exercice
  @Post()
  async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    return this.fitnessExerciseApiService.createExercise(createExerciseDto);
  }

  // Route pour obtenir les exercices par groupe musculaire
  @Get('muscleGroup/:muscleGroup')
  async getExercisesByMuscleGroup(@Param('muscleGroup') muscleGroup: string) {
    return this.fitnessExerciseApiService.getExercisesByMuscleGroup(
      muscleGroup,
    );
  }

  // Route pour obtenir les exercices par titre
  @Get('title/:title')
  async getExercisesByTitle(@Param('title') title: string) {
    return this.fitnessExerciseApiService.getExercisesByTitle(title);
  }

  // Nouvelle route pour obtenir les exercices par groupe musculaire et titre
  @Get('muscleGroup/:muscleGroup/title/:title')
  async getExercisesByMuscleGroupAndTitle(
    @Param('muscleGroup') muscleGroup: string,
    @Param('title') title: string,
  ) {
    return this.fitnessExerciseApiService.getExercisesByMuscleGroupAndTitle(
      muscleGroup,
      title,
    );
  }

  // Route pour obtenir les exercices selon une plage de calories
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

  // Route pour obtenir un exercice par son type (e.g., Musculation, Cardio)
  @Get('type/:type')
  async getExercisesByType(@Param('type') type: string) {
    return this.fitnessExerciseApiService.getExercisesByType(type);
  }

  // Route pour obtenir les exercices par répétitions
  @Get('reps/:repsType/:range')
  async getExercisesByReps(
    @Param('repsType') repsType: string,
    @Param('range') range: string,
  ) {
    return this.fitnessExerciseApiService.getExercisesByReps(repsType, range);
  }

  // Route pour obtenir un exercice par son ID
  @Get(':id')
  async getExerciseById(@Param('id') id: string) {
    return this.fitnessExerciseApiService.getExerciseById(id);
  }

  // Nouvelle route pour gérer les likes/unlikes
  @Patch(':id/like-unlike')
  async toggleLikeOrUnlike(
    @Param('id') exerciseId: string,
    @Body() toggleLikeDto: ToggleLikeDto, // Utilisation du DTO pour valider les données
  ) {
    return this.fitnessExerciseApiService.toggleLikeOrUnlike(
      exerciseId,
      toggleLikeDto,
    );
  }
}

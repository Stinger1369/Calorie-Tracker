import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { RecommendationFoodService } from './recommendation-food.service';
import { CreateRecommendationFoodDto } from './create-recommendation-food.dto';
import { RecommendationFood } from './schemas/recommendation-food.schema';

@Controller('recommendation-food')
export class RecommendationFoodController {
  private readonly logger = new Logger(RecommendationFoodController.name);

  constructor(
    private readonly recommendationFoodService: RecommendationFoodService,
  ) {}

  @Post()
  async create(
    @Body() createRecommendationFoodDto: CreateRecommendationFoodDto,
  ): Promise<RecommendationFood> {
    this.logger.log('Creating a new recommendation...');
    const result = await this.recommendationFoodService.create(
      createRecommendationFoodDto,
    );
    this.logger.log(`Created recommendation with ID: ${result._id}`);
    return result;
  }

  @Get()
  async findAll(): Promise<RecommendationFood[]> {
    this.logger.log('Fetching all recommendations...');
    return this.recommendationFoodService.findAll();
  }

  @Get('calories/:calories')
  async findByExactCalories(
    @Param('calories', ParseIntPipe) calories: number,
  ): Promise<RecommendationFood[]> {
    return this.recommendationFoodService.findByExactCalories(calories);
  }

  @Get('calories-range')
  async findByCaloriesRange(
    @Query('minCalories', ParseIntPipe) minCalories: number,
    @Query('maxCalories', ParseIntPipe) maxCalories: number,
  ): Promise<RecommendationFood[]> {
    return this.recommendationFoodService.findByCaloriesRange(
      minCalories,
      maxCalories,
    );
  }

  @Get('season/:season')
  async findBySeason(
    @Param('season') season: string,
  ): Promise<RecommendationFood[]> {
    return this.recommendationFoodService.findBySeason(season);
  }

  @Get('search')
  async findByIMCAndSeason(
    @Query('classificationIMC') classificationIMC: string,
    @Query('season') season: string,
    @Query('minCalories', ParseIntPipe) minCalories?: number,
    @Query('maxCalories', ParseIntPipe) maxCalories?: number,
  ): Promise<RecommendationFood[]> {
    this.logger.log(
      `Search request for classificationIMC: ${classificationIMC}, season: ${season}, minCalories: ${minCalories}, maxCalories: ${maxCalories}`,
    );

    const results = await this.recommendationFoodService.findByIMCAndSeason(
      classificationIMC,
      season,
      minCalories,
      maxCalories,
    );

    this.logger.log(`Returned ${results.length} results for the search.`);
    return results;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RecommendationFood> {
    this.logger.log(`Fetching recommendation with ID: ${id}`);
    return this.recommendationFoodService.findOne(id);
  }
}

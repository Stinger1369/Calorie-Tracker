import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RecommendationFood,
  RecommendationFoodDocument,
} from './schemas/recommendation-food.schema';
import { CreateRecommendationFoodDto } from './create-recommendation-food.dto';

@Injectable()
export class RecommendationFoodService {
  private readonly logger = new Logger(RecommendationFoodService.name);

  constructor(
    @InjectModel(RecommendationFood.name)
    private recommendationFoodModel: Model<RecommendationFoodDocument>,
  ) {}

  /**
   * Créer une nouvelle recommandation de nourriture
   * @param createRecommendationFoodDto - Les données de la nouvelle recommandation
   * @returns La recommandation créée
   */
  async create(
    createRecommendationFoodDto: CreateRecommendationFoodDto,
  ): Promise<RecommendationFood> {
    const createdRecommendation = new this.recommendationFoodModel(
      createRecommendationFoodDto,
    );
    return createdRecommendation.save();
  }

  /**
   * Trouver toutes les recommandations de nourriture
   * @returns Liste de toutes les recommandations
   */
  async findAll(): Promise<RecommendationFood[]> {
    return this.recommendationFoodModel.find().exec();
  }

  /**
   * Rechercher uniquement par nombre de calories exact
   * @param calories - Le nombre exact de calories
   * @returns Liste des recommandations avec ce nombre exact de calories
   */
  async findByExactCalories(calories: number): Promise<RecommendationFood[]> {
    this.logger.debug(
      `Recherche pour les recettes avec exactement ${calories} calories.`,
    );

    const results = await this.recommendationFoodModel
      .find({ EstimatedCalories: calories }) // Utilisation correcte de "EstimatedCalories"
      .exec();

    this.logger.debug(`Nombre de résultats trouvés: ${results.length}`);
    return results;
  }

  /**
   * Rechercher par plage de calories avec limitation par le nombre de jours du mois
   * @param minCalories - Le nombre minimum de calories
   * @param maxCalories - Le nombre maximum de calories
   * @returns Liste des recommandations dans cette plage de calories
   */
  async findByCaloriesRange(
    minCalories: number,
    maxCalories: number,
  ): Promise<RecommendationFood[]> {
    this.logger.debug(
      `Recherche pour les recettes entre ${minCalories} et ${maxCalories} calories.`,
    );

    const currentMonth = new Date().getMonth(); // Mois actuel
    const currentYear = new Date().getFullYear();

    // Nombre de jours dans le mois actuel
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const results = await this.recommendationFoodModel
      .find({
        EstimatedCalories: { $gte: minCalories, $lte: maxCalories }, // Utilisation correcte de "EstimatedCalories"
      })
      .limit(daysInMonth) // Limiter les résultats au nombre de jours du mois
      .exec();

    this.logger.debug(`Nombre de résultats trouvés: ${results.length}`);
    return results;
  }

  /**
   * Rechercher uniquement par saison
   * @param season - La saison pour laquelle rechercher
   * @returns Liste des recommandations pour cette saison
   */
  async findBySeason(season: string): Promise<RecommendationFood[]> {
    this.logger.debug(`Recherche pour la saison : ${season}.`);

    const results = await this.recommendationFoodModel
      .find({ Season: new RegExp(season, 'i') }) // Utilisation correcte de "Season"
      .exec();

    this.logger.debug(`Nombre de résultats trouvés: ${results.length}`);
    return results;
  }

  /**
   * Rechercher par combinaison de critères (calories, saison, IMC)
   * @param classificationIMC - La classification IMC pour laquelle rechercher
   * @param season - La saison pour laquelle rechercher
   * @param minCalories - Nombre minimum de calories (optionnel)
   * @param maxCalories - Nombre maximum de calories (optionnel)
   * @returns Liste des recommandations correspondant aux critères
   */
  async findByIMCAndSeason(
    classificationIMC: string,
    season: string,
    minCalories?: number,
    maxCalories?: number,
  ): Promise<RecommendationFood[]> {
    this.logger.debug(
      `Recherche pour IMC: ${classificationIMC}, Saison: ${season}, MinCalories: ${minCalories}, MaxCalories: ${maxCalories}`,
    );

    const query: any = {};

    // Condition pour classificationIMC
    if (classificationIMC) {
      query.classificationIMC = new RegExp(classificationIMC, 'i');
    }

    // Condition pour season
    if (season) {
      query.Season = new RegExp(season, 'i'); // Utilisation correcte de "Season"
    }

    // Condition pour les calories
    if (minCalories !== undefined && maxCalories !== undefined) {
      query.EstimatedCalories = { $gte: minCalories, $lte: maxCalories }; // Utilisation correcte de "EstimatedCalories"
    } else if (minCalories !== undefined) {
      query.EstimatedCalories = { $gte: minCalories }; // Utilisation correcte de "EstimatedCalories"
    } else if (maxCalories !== undefined) {
      query.EstimatedCalories = { $lte: maxCalories }; // Utilisation correcte de "EstimatedCalories"
    }

    this.logger.debug(`Generated query: ${JSON.stringify(query)}`);

    const results = await this.recommendationFoodModel.find(query).exec();
    this.logger.debug(`Nombre de résultats trouvés: ${results.length}`);
    return results;
  }

  /**
   * Trouver une recommandation par ID
   * @param id - L'ID de la recommandation à trouver
   * @returns La recommandation trouvée
   * @throws NotFoundException si la recommandation n'est pas trouvée
   */
  async findOne(id: string): Promise<RecommendationFood> {
    this.logger.log(`Looking for recommendation with ID: ${id}`);

    try {
      let objectId;
      if (
        Types.ObjectId.isValid(id) &&
        new Types.ObjectId(id).toString() === id
      ) {
        objectId = new Types.ObjectId(id);
      } else {
        this.logger.error(`Invalid ObjectId format: ${id}`);
        throw new NotFoundException(`Recommendation with ID ${id} not found`);
      }

      const recommendation = await this.recommendationFoodModel
        .findById(objectId)
        .exec();

      if (!recommendation) {
        this.logger.error(`Recommendation with ID ${id} not found`);
        throw new NotFoundException(`Recommendation with ID ${id} not found`);
      }

      this.logger.log(`Recommendation found: ${recommendation._id}`);
      return recommendation;
    } catch (error) {
      this.logger.error(`Error during findOne: ${error.message}`);
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }
  }
}

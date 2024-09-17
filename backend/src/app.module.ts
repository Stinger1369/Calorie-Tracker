import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FoodConsumptionModule } from './food-consumption/food-consumption.module';
import { ExerciseModule } from './exercises/exercise.module';
import { FitnessGoalModule } from './fitness-goals/fitness-goal.module';
import { RecommendationFoodModule } from './recommendation-food/recommendation-food.module';
import { StepCountModule } from './step-count/step-count.module';
import { FitnessExerciseModule } from './ApiExercice/api-exercice-api.module';
import { CustomProgramsExerciceModule } from './custom-programs-exercice/custom-programs-exercice.module'; // Ajout de l'import pour CustomProgramsExercice

import { ImageModule } from './image/image.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/LoggerMiddleware';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost/nest',
    ),
    UsersModule,
    AuthModule,
    FoodConsumptionModule,
    ExerciseModule,
    FitnessGoalModule,
    RecommendationFoodModule,
    StepCountModule,
    FitnessExerciseModule,
    CustomProgramsExerciceModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Appliquer le middleware à toutes les routes
  }
}

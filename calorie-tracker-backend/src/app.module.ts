import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FoodConsumptionModule } from './food-consumption/food-consumption.module';
import { ExerciseModule } from './exercises/exercise.module';
import { FitnessGoalModule } from './fitness-goals/fitness-goal.module';
import { RecommendationFoodModule } from './recommendation-food/recommendation-food.module';
import { StepCountModule } from './step-count/step-count.module';
import { ApiExerciceModule } from './ApiExercice/api-exercice.module';
import { ImageModule } from './image/image.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/LoggerMiddleware'; // Assurez-vous que le chemin est correct

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
    ApiExerciceModule,
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

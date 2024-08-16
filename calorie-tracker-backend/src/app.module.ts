import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FoodConsumptionModule } from './food-consumption/food-consumption.module';
import { ExerciseModule } from './exercises/exercise.module';
import { FitnessGoalModule } from './fitness-goals/fitness-goal.module';
import { RecommendationFoodModule } from './recommendation-food/recommendation-food.module';
import { StepCountModule } from './step-count/step-count.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FoodConsumptionModule } from './food-consumption/food-consumption.module';
import { ExerciseModule } from './exercises/exercise.module';
import { FitnessGoalModule } from './fitness-goals/fitness-goal.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Retirer l'import de AppGateway
// import { AppGateway } from './app.gateway';

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
  ],
  controllers: [AppController],
  providers: [AppService], // Retirer AppGateway ici
})
export class AppModule {}

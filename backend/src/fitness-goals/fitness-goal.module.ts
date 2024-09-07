import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FitnessGoalService } from './fitness-goal.service';
import { FitnessGoalController } from './fitness-goal.controller';
import { FitnessGoal, FitnessGoalSchema } from './schemas/fitness-goal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FitnessGoal.name, schema: FitnessGoalSchema },
    ]),
  ],
  controllers: [FitnessGoalController],
  providers: [FitnessGoalService],
})
export class FitnessGoalModule {}

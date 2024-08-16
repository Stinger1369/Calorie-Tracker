// src/step-count/step-count.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StepCountService } from './step-count.service';
import { StepCountController } from './step-count.controller';
import { StepCount, StepCountSchema } from './schemas/step-count.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StepCount.name, schema: StepCountSchema },
    ]),
  ],
  controllers: [StepCountController],
  providers: [StepCountService],
})
export class StepCountModule {}

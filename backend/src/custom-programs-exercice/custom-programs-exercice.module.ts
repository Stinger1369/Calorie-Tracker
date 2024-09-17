import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomProgramsExerciceService } from './custom-programs-exercice.service';
import { CustomProgramsExerciceController } from './custom-programs-exercice.controller';
import {
  CustomProgramsExercice,
  CustomProgramsExerciceSchema,
} from './scheams/custom-programs-exercice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CustomProgramsExercice.name,
        schema: CustomProgramsExerciceSchema,
      },
    ]),
  ],
  controllers: [CustomProgramsExerciceController],
  providers: [CustomProgramsExerciceService],
})
export class CustomProgramsExerciceModule {}

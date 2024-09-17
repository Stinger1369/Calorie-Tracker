import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomProgramsExercice } from './scheams/custom-programs-exercice.schema';
import { CreateCustomProgramExerciceDto } from './dto/create-custom-program-exercice.dto';

@Injectable()
export class CustomProgramsExerciceService {
  constructor(
    @InjectModel(CustomProgramsExercice.name)
    private customProgramsExerciceModel: Model<CustomProgramsExercice>,
  ) {}

  async create(
    userId: string,
    createCustomProgramExerciceDto: CreateCustomProgramExerciceDto,
  ): Promise<CustomProgramsExercice> {
    const newProgram = new this.customProgramsExerciceModel({
      ...createCustomProgramExerciceDto,
      userId,
    });
    return await newProgram.save();
  }

  async findAllByUser(userId: string): Promise<CustomProgramsExercice[]> {
    return this.customProgramsExerciceModel.find({ userId }).exec();
  }

  async updateProgram(
    userId: string,
    programId: string,
    updateDto: Partial<CreateCustomProgramExerciceDto>,
  ): Promise<CustomProgramsExercice> {
    const updatedProgram =
      await this.customProgramsExerciceModel.findOneAndUpdate(
        { _id: programId, userId },
        updateDto,
        { new: true },
      );
    if (!updatedProgram) {
      throw new NotFoundException('Program not found');
    }
    return updatedProgram;
  }
}

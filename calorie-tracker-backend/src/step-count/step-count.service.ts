// src/step-count/step-count.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StepCount, StepCountDocument } from './schemas/step-count.schema';
import { CreateStepCountDto } from './dto/create-step-count.dto';
import { UpdateStepCountDto } from './dto/update-step-count.dto';

@Injectable()
export class StepCountService {
  constructor(
    @InjectModel(StepCount.name)
    private stepCountModel: Model<StepCountDocument>,
  ) {}

  async create(createStepCountDto: CreateStepCountDto): Promise<StepCount> {
    const newStepCount = new this.stepCountModel(createStepCountDto);
    return newStepCount.save();
  }

  async findAll(): Promise<StepCount[]> {
    return this.stepCountModel.find().exec();
  }

  async findByUserId(userId: string): Promise<StepCount[]> {
    return this.stepCountModel.find({ userId }).exec();
  }

  async update(
    userId: string,
    updateStepCountDto: UpdateStepCountDto,
  ): Promise<StepCount> {
    const existingStepCount = await this.stepCountModel.findOneAndUpdate(
      { userId, date: updateStepCountDto.date },
      updateStepCountDto,
      { new: true, upsert: true },
    );
    if (!existingStepCount) {
      throw new NotFoundException(`Step data for user ${userId} not found`);
    }
    return existingStepCount;
  }
}

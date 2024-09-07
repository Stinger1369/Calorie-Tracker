// src/step-count/step-count.controller.ts
import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { StepCountService } from './step-count.service';
import { CreateStepCountDto } from './dto/create-step-count.dto';
import { UpdateStepCountDto } from './dto/update-step-count.dto';

@Controller('step-count')
export class StepCountController {
  constructor(private readonly stepCountService: StepCountService) {}

  @Post()
  async create(@Body() createStepCountDto: CreateStepCountDto) {
    return this.stepCountService.create(createStepCountDto);
  }

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.stepCountService.findByUserId(userId);
  }

  @Put(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateStepCountDto: UpdateStepCountDto,
  ) {
    return this.stepCountService.update(userId, updateStepCountDto);
  }
}

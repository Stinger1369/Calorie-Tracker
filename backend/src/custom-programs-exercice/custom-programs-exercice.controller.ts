import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CustomProgramsExerciceService } from './custom-programs-exercice.service';
import { CreateCustomProgramExerciceDto } from './dto/create-custom-program-exercice.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('custom-programs-exercice')
@UseGuards(AuthGuard('jwt'))
export class CustomProgramsExerciceController {
  constructor(
    private readonly customProgramsExerciceService: CustomProgramsExerciceService,
  ) {}

  @Post()
  async create(
    @Body('userId') userId: string,
    @Body() createCustomProgramExerciceDto: CreateCustomProgramExerciceDto,
  ) {
    return this.customProgramsExerciceService.create(
      userId,
      createCustomProgramExerciceDto,
    );
  }

  @Get(':userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.customProgramsExerciceService.findAllByUser(userId);
  }

  @Patch(':programId')
  async updateProgram(
    @Param('userId') userId: string,
    @Param('programId') programId: string,
    @Body() updateDto: Partial<CreateCustomProgramExerciceDto>,
  ) {
    return this.customProgramsExerciceService.updateProgram(
      userId,
      programId,
      updateDto,
    );
  }
}

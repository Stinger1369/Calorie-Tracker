import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersService.create(createUserDto);
    console.log('New user created:', newUser);
    return newUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    console.log('All users retrieved:', users);
    return users;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    // L'ID doit être une chaîne ici.
    return this.usersService.findOne(id);
  }

  @Put(':id/bmi')
  async updateBMI(
    @Param('id') id: string,
    @Body('bmi') bmi: number,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateBMI(id, bmi);
    console.log('User BMI updated:', updatedUser);
    return updatedUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    console.log('User updated:', updatedUser);
    return updatedUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
    console.log('User deleted with ID:', id);
  }
}

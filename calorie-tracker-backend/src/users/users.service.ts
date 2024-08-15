import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { calculateBMI } from '../functions/imc.function';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    let baseUsername =
      `${createUserDto.firstName}.${createUserDto.lastName}`.toLowerCase();
    let username = baseUsername;
    let counter = 1;

    while (await this.userModel.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    const user = new this.userModel({
      ...createUserDto,
      username,
    });

    // Calculer l'IMC lors de la création si les données sont présentes
    if (user.weight && user.height) {
      user.bmi = calculateBMI(user.weight, user.height);
    }

    await user.save();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedData = { ...updateUserDto };

    if (updateUserDto.username) {
      let baseUsername = updateUserDto.username.toLowerCase();
      let username = baseUsername;
      let counter = 1;

      while (await this.userModel.findOne({ username, _id: { $ne: id } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      updatedData.username = username;
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();

    if (updateUserDto.dateOfBirth) {
      user.horoscope = this.getHoroscope(updateUserDto.dateOfBirth);
    }

    // Recalculer l'IMC si le poids ou la taille ont été mis à jour
    if (updateUserDto.weight || updateUserDto.height) {
      user.bmi = calculateBMI(user.weight, user.height);
    }

    await user.save();
    return user;
  }

  async updateDailyExercise(
    userId: string,
    exerciseName: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!Array.isArray(user.dailyExercise)) {
      user.dailyExercise = [];
    }

    await this.userModel
      .updateOne(
        { _id: userId },
        { $addToSet: { dailyExercise: exerciseName } },
      )
      .exec();
  }

  async removeDailyExercise(
    userId: string,
    exerciseName: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel
      .updateOne({ _id: userId }, { $pull: { dailyExercise: exerciseName } })
      .exec();
  }

  async updateBMI(userId: string, bmi: number): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: { bmi: bmi } }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  private getHoroscope(dateOfBirth: Date): string {
    const month = dateOfBirth.getMonth() + 1;
    const day = dateOfBirth.getDate();

    const zodiacSigns = [
      { name: 'Capricorn', startDate: [1, 1], endDate: [1, 19] },
      { name: 'Aquarius', startDate: [1, 20], endDate: [2, 18] },
      { name: 'Pisces', startDate: [2, 19], endDate: [3, 20] },
      { name: 'Aries', startDate: [3, 21], endDate: [4, 19] },
      { name: 'Taurus', startDate: [4, 20], endDate: [5, 20] },
      { name: 'Gemini', startDate: [5, 21], endDate: [6, 20] },
      { name: 'Cancer', startDate: [6, 21], endDate: [7, 22] },
      { name: 'Leo', startDate: [7, 23], endDate: [8, 22] },
      { name: 'Virgo', startDate: [8, 23], endDate: [9, 22] },
      { name: 'Libra', startDate: [9, 23], endDate: [10, 22] },
      { name: 'Scorpio', startDate: [10, 23], endDate: [11, 21] },
      { name: 'Sagittarius', startDate: [11, 22], endDate: [12, 21] },
      { name: 'Capricorn', startDate: [12, 22], endDate: [12, 31] },
    ];

    return (
      zodiacSigns.find((sign) =>
        this.isDateInRange(month, day, sign.startDate, sign.endDate),
      )?.name || 'Unknown'
    );
  }

  private isDateInRange(
    month: number,
    day: number,
    start: number[],
    end: number[],
  ): boolean {
    const date = month * 100 + day;
    const startDate = start[0] * 100 + start[1];
    const endDate = end[0] * 100 + end[1];

    return date >= startDate && date <= endDate;
  }
}

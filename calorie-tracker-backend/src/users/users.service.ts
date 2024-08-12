import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    let baseUsername =
      `${createUserDto.firstName}.${createUserDto.lastName}`.toLowerCase();
    let username = baseUsername;
    let counter = 1;

    // Vérifie l'unicité du username
    while (await this.userModel.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    const user = new this.userModel({
      ...createUserDto,
      username, // Attribue le username unique
    });

    await user.save();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedData = { ...updateUserDto };

    if (updateUserDto.username) {
      let baseUsername = updateUserDto.username.toLowerCase();
      let username = baseUsername;
      let counter = 1;

      // Vérifie l'unicité du username pour cet utilisateur
      while (await this.userModel.findOne({ username, _id: { $ne: id } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      updatedData.username = username; // Attribue le username unique dans une copie
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updatedData, {
        new: true,
      })
      .exec();

    // Recalcule l'horoscope après la mise à jour si la date de naissance est modifiée
    if (updateUserDto.dateOfBirth) {
      user.horoscope = this.getHoroscope(updateUserDto.dateOfBirth);
      await user.save(); // Sauvegarder seulement si l'horoscope est recalculé
    }

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

    // Assurez-vous que dailyExercise est un tableau
    if (!Array.isArray(user.dailyExercise)) {
      user.dailyExercise = [];
    }

    // Utiliser $addToSet pour ajouter uniquement si l'élément n'existe pas déjà
    await this.userModel
      .updateOne(
        { _id: userId },
        { $addToSet: { dailyExercise: exerciseName } },
      )
      .exec();
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

  private getHoroscope(dateOfBirth: any): string {
    const date = new Date(dateOfBirth);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month == 1 && day >= 20) || (month == 2 && day <= 18))
      return 'Aquarius';
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21))
      return 'Scorpio';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21))
      return 'Sagittarius';
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19))
      return 'Capricorn';

    return 'Unknown';
  }
}

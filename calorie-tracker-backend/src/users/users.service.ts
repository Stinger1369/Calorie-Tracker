import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { calculateBMI } from '../functions/imc.function';
import { calculateCaloricNeeds } from '../functions/calculateCaloricNeeds';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { getHoroscope } from '../utils/zodiac-signs.util';
import { ImageService } from '../image/image.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly imageService: ImageService, // Injection du service Image
    private readonly httpService: HttpService,
  ) {}

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  async updateHoroscope(user: User) {
    if (user.dateOfBirth) {
      const dateOfBirthStr = user.dateOfBirth.toISOString().split('T')[0]; // Format YYYY-MM-DD
      const url = `http://localhost:8000/horoscope?date_of_birth=${dateOfBirthStr}&bmi=${user.bmi}&first_name=${user.firstName}&last_name=${user.lastName}`;

      // Appel à l'API FastAPI pour obtenir l'horoscope
      const response = await firstValueFrom(this.httpService.get(url));
      user.horoscope = response.data.horoscope; // Assigner l'horoscope récupéré

      // Utiliser l'utilitaire zodiac-signs.util.ts pour déterminer le signe
      const month = new Date(user.dateOfBirth).getMonth() + 1;
      const day = new Date(user.dateOfBirth).getDate();
      user.zodiacSign = getHoroscope(month, day); // Assigner le signe astrologique
    }
  }

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

    // Calculer l'IMC et les besoins caloriques lors de la création si les données sont présentes
    if (user.weight && user.height) {
      user.bmi = calculateBMI(user.weight, user.height);

      if (user.dateOfBirth && user.gender) {
        const age = this.calculateAge(user.dateOfBirth);
        user.recommendedCalories = calculateCaloricNeeds(
          user.gender as 'male' | 'female' | 'other',
          user.weight,
          user.height,
          age,
        );
      }
    }

    // Déterminer l'horoscope initial via l'API FastAPI et le signe astrologique
    await this.updateHoroscope(user);

    await user.save();
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    imageBuffer: Buffer,
  ): Promise<User> {
    const updatedData = { ...updateUserDto };

    if (imageBuffer) {
      try {
        // Appelle le service pour mettre à jour l'image
        const imageUrl = await this.imageService.updateImage(
          id,
          'profile.jpg',
          imageBuffer,
        );
        // Assigner l'URL de l'image mise à jour
        updatedData.imageUrl = imageUrl;
      } catch (error) {
        throw new HttpException(
          "Erreur lors du téléchargement de l'image.",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

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

    let user = await this.userModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();

    if (updateUserDto.dateOfBirth) {
      await this.updateHoroscope(user);
    }

    if (
      updateUserDto.weight ||
      updateUserDto.height ||
      updateUserDto.dateOfBirth ||
      updateUserDto.gender
    ) {
      if (user.weight && user.height) {
        user.bmi = calculateBMI(user.weight, user.height);

        if (user.dateOfBirth && user.gender) {
          const age = this.calculateAge(user.dateOfBirth);
          user.recommendedCalories = calculateCaloricNeeds(
            user.gender as 'male' | 'female' | 'other',
            user.weight,
            user.height,
            age,
          );
        }
      }
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
    console.log('ID reçu dans findOne:', id); // Ajoutez cette ligne pour vérifier l'ID

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
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
}

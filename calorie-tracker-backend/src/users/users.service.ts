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
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
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
    imageUrl: string, // L'URL de l'image est reçue ici
  ): Promise<User> {
    console.log('--- Début de la méthode update ---');
    console.log('ID utilisateur reçu:', id);
    console.log('Données de mise à jour reçues:', updateUserDto);
    console.log('URL de l’image reçue:', imageUrl);

    const updatedData = { ...updateUserDto };

    // Assigner l'URL complète de l'image si elle est fournie
    if (imageUrl) {
      const fullImageUrl = `${this.configService.get<string>('IMAGE_SERVER_URL')}${imageUrl}`;
      updatedData.imageUrl = fullImageUrl;
      console.log(
        'URL complète de l’image assignée à updatedData:',
        updatedData.imageUrl,
      );
    } else {
      console.log('Aucune URL d’image fournie');
    }

    // Mise à jour du nom d'utilisateur si nécessaire
    if (updateUserDto.username) {
      console.log('Mise à jour du nom d’utilisateur...');
      let baseUsername = updateUserDto.username.toLowerCase();
      let username = baseUsername;
      let counter = 1;

      while (await this.userModel.findOne({ username, _id: { $ne: id } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      updatedData.username = username;
      console.log('Nom d’utilisateur final:', updatedData.username);
    }

    console.log('Données finales avant mise à jour dans MongoDB:', updatedData);

    let user;
    try {
      user = await this.userModel
        .findByIdAndUpdate(id, updatedData, { new: true })
        .exec();
      console.log('Utilisateur mis à jour avec succès dans MongoDB:', user);
    } catch (error) {
      console.error('Erreur lors de la mise à jour dans MongoDB:', error);
      throw new HttpException(
        'Erreur lors de la mise à jour de l’utilisateur',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Si la date de naissance a été mise à jour, mettre à jour l’horoscope
    if (updateUserDto.dateOfBirth) {
      console.log('Mise à jour de l’horoscope...');
      await this.updateHoroscope(user);
    }

    // Recalcul des valeurs liées à l'IMC et aux calories si des données pertinentes sont mises à jour
    if (
      updateUserDto.weight ||
      updateUserDto.height ||
      updateUserDto.dateOfBirth ||
      updateUserDto.gender
    ) {
      if (user.weight && user.height) {
        user.bmi = calculateBMI(user.weight, user.height);
        console.log('Nouvel IMC calculé:', user.bmi);

        if (user.dateOfBirth && user.gender) {
          const age = this.calculateAge(user.dateOfBirth);
          user.recommendedCalories = calculateCaloricNeeds(
            user.gender as 'male' | 'female' | 'other',
            user.weight,
            user.height,
            age,
          );
          console.log(
            'Nouveau besoin calorique recommandé:',
            user.recommendedCalories,
          );
        }
      }
    }

    try {
      await user.save();
      console.log('Utilisateur sauvegardé avec succès:', user);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l’utilisateur:', error);
      throw new HttpException(
        'Erreur lors de la sauvegarde de l’utilisateur',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    console.log('--- Fin de la méthode update ---');
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

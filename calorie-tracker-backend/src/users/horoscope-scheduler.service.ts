import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from './users.service'; // Assurez-vous de bien référencer le UsersService

@Injectable()
export class HoroscopeSchedulerService {
  constructor(private readonly usersService: UsersService) {}

  @Cron('0 0 * * *') // Exécute le job chaque jour à minuit
  async updateDailyHoroscopes() {
    const users = await this.usersService.findAll();

    for (const user of users) {
      if (user.dateOfBirth) {
        await this.usersService.updateHoroscope(user); // Mettez à jour l'horoscope pour chaque utilisateur avec l'IMC
        await user.save(); // Sauvegardez les modifications
      }
    }

    console.log('Horoscopes mis à jour pour tous les utilisateurs.');
  }
}

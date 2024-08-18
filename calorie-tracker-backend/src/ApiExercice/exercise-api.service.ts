import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExerciseApiService {
  constructor(private readonly httpService: HttpService) {}

  async getExercises(): Promise<any> {
    const options = {
      method: 'GET',
      url: 'https://exercisedb.p.rapidapi.com/exercises',
      headers: {
        'x-rapidapi-key': '9a9d85db19mshbf2831b95f75396p1ec5dajsn986d01ee568b',
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    };

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.request(options),
      );

      // Ajout du console.log pour voir les données
      console.log('Données reçues de l\'API externe:', response.data);

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch exercises: ${error.message}`);
    }
  }
}

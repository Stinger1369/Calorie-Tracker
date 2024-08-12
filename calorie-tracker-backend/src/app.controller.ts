// calorie-tracker-backend/src/app.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    @Inject('RECOMMENDATION_SERVICE') private client: ClientProxy, // Injecter le client du microservice
  ) {}

  @Get('recommendations/:userId')
  async getRecommendations(@Param('userId') userId: string) {
    // Envoyer l'ID utilisateur au microservice pour obtenir les recommandations
    return this.client.send({ cmd: 'get_recommendation' }, userId).toPromise();
  }
}

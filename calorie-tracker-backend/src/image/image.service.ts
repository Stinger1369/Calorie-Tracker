import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ImageService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async uploadImage(
    fileBuffer: Buffer,
    userId: string,
    imageName: string,
  ): Promise<string> {
    console.log('--- Début de la méthode uploadImage ---');
    console.log('ID utilisateur reçu:', userId);
    console.log('Nom de l’image reçu:', imageName);

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('nom', imageName);
    formData.append('image', fileBuffer, imageName);

    const imageServerUrl = this.configService.get<string>('IMAGE_SERVER_URL');
    console.log('URL du serveur d’images:', imageServerUrl);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${imageServerUrl}/server-image/ajouter-image`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );
      console.log('Réponse reçue du serveur d’images:', response.data);

      // Assurez-vous que la réponse contient bien une URL
      if (!response.data.link) {
        throw new Error(
          'Image upload failed: Invalid response from image server',
        );
      }

      const imageUrl = response.data.link;
      console.log('URL de l’image extraite:', imageUrl);

      console.log('--- Fin de la méthode uploadImage ---');
      return imageUrl;
    } catch (error) {
      console.error('Erreur lors de l’upload de l’image:', error);
      throw new HttpException(
        'Failed to upload image to external server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateImage(
    userId: string,
    imageName: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('nom', imageName);
    formData.append('image', fileBuffer, imageName);

    const imageServerUrl = this.configService.get<string>('IMAGE_SERVER_URL');

    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${imageServerUrl}/server-image/update-image/${userId}/${imageName}`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );
      return response.data.link;
    } catch (error) {
      throw new HttpException(
        'Failed to update image on external server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImage(userId: string, imageName: string): Promise<void> {
    const imageServerUrl = this.configService.get<string>('IMAGE_SERVER_URL');

    try {
      await firstValueFrom(
        this.httpService.delete(
          `${imageServerUrl}/server-image/delete-image/${userId}/${imageName}`,
        ),
      );
    } catch (error) {
      throw new HttpException(
        'Failed to delete image from external server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

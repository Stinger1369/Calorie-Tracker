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
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('nom', imageName);
    formData.append('image', fileBuffer, imageName);

    const imageServerUrl = this.configService.get<string>('IMAGE_SERVER_URL');

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
      // On suppose que l'URL de l'image est renvoyée dans le champ `link` de la réponse
      return response.data.link;
    } catch (error) {
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

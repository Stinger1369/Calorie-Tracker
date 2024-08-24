import {
  Controller,
  Post,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('user_id') userId: string,
    @Body('image_name') imageName: string,
  ) {
    console.log('--- Début de la méthode uploadImage dans ImageController ---');
    console.log('ID utilisateur reçu:', userId);
    console.log('Nom de l’image reçu:', imageName);

    try {
      const imageUrl = await this.imageService.uploadImage(
        file.buffer,
        userId,
        imageName,
      );
      console.log('URL de l’image retournée:', imageUrl);

      console.log('--- Fin de la méthode uploadImage dans ImageController ---');
      return { imageUrl };
    } catch (error) {
      console.error(
        'Erreur lors de l’upload de l’image dans ImageController:',
        error,
      );
      throw new HttpException(
        'Failed to upload image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('update/:userId/:imageName')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string,
    @Param('imageName') imageName: string,
  ) {
    console.log('--- Début de la méthode updateImage dans ImageController ---');
    console.log('ID utilisateur reçu:', userId);
    console.log('Nom de l’image reçu:', imageName);

    try {
      const imageUrl = await this.imageService.updateImage(
        userId,
        imageName,
        file.buffer,
      );
      console.log('URL de l’image retournée après mise à jour:', imageUrl);

      console.log('--- Fin de la méthode updateImage dans ImageController ---');
      return { imageUrl };
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de l’image dans ImageController:',
        error,
      );
      throw new HttpException(
        'Failed to update image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:userId/:imageName')
  async deleteImage(
    @Param('userId') userId: string,
    @Param('imageName') imageName: string,
  ) {
    console.log('--- Début de la méthode deleteImage dans ImageController ---');
    console.log('ID utilisateur reçu:', userId);
    console.log('Nom de l’image reçu:', imageName);

    try {
      await this.imageService.deleteImage(userId, imageName);
      console.log('Image supprimée avec succès');

      console.log('--- Fin de la méthode deleteImage dans ImageController ---');
      return { message: 'Image deleted successfully' };
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de l’image dans ImageController:',
        error,
      );
      throw new HttpException(
        'Failed to delete image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


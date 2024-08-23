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
    try {
      const imageUrl = await this.imageService.uploadImage(
        file.buffer,
        userId,
        imageName,
      );
      return { imageUrl };
    } catch (error) {
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
    try {
      const imageUrl = await this.imageService.updateImage(
        userId,
        imageName,
        file.buffer,
      );
      return { imageUrl };
    } catch (error) {
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
    try {
      await this.imageService.deleteImage(userId, imageName);
      return { message: 'Image deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

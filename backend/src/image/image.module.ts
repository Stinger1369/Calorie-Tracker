import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService], // Exporting ImageService to be used in other modules
})
export class ImageModule {}

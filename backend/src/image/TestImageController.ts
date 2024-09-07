// import { Controller, Get } from '@nestjs/common';
// import { ImageService } from './image.service';

// @Controller('test-image')
// export class TestImageController {
//   constructor(private readonly imageService: ImageService) {}

//   @Get('tester-upload')
//   async testerUpload() {
//     const imagePath =
//       'H:\\calorie\\image-server\\public\\images\\12345\\test.jpg';
//     const imageData = {
//       buffer: require('fs').readFileSync(imagePath),
//       originalname: 'test.jpg',
//       mimetype: 'image/jpeg',
//     };

//     const imageUrl = await this.imageService.ajouterImage(
//       '12345',
//       'test.jpg',
//       imageData,
//     );
//     return { message: 'Image uploadée avec succès', link: imageUrl };
//   }
// }

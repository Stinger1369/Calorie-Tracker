import { IsNotEmpty, IsString } from 'class-validator';

export class AjouterImageDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  imageBuffer: Buffer;
}

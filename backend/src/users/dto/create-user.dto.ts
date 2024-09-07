import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;


  @IsOptional()
  @IsString()
  readonly verificationCode?: string;

  // Ajoute ceci si nécessaire
  @IsOptional()
  @IsBoolean()
  readonly isVerified?: boolean;
}

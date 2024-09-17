import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
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
  @MinLength(6, {
    message: 'Password is too short. It must be at least 6 characters.',
  })
  readonly password: string;

  @IsNotEmpty()
  @MinLength(6, {
    message:
      'Confirmation password is too short. It must be at least 6 characters.',
  })
  readonly confirmPassword: string;

  @IsOptional() // Optional field for Google users
  readonly googleId?: string;
}

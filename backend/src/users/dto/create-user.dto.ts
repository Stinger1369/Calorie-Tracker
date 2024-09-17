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

  @IsOptional() // Make password optional for Google login
  @MinLength(6)
  readonly password?: string;

  @IsOptional()
  @IsString()
  readonly googleId?: string; // Field for Google ID

  @IsOptional()
  @IsString()
  readonly verificationCode?: string;

  @IsOptional()
  @IsBoolean()
  readonly isVerified?: boolean;
}

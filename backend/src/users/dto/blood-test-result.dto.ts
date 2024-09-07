import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsString,
  IsOptional,
} from 'class-validator';

export class BloodTestResultDto {
  @IsNotEmpty()
  @IsNumber()
  readonly cholesterol: number;

  @IsNotEmpty()
  @IsNumber()
  readonly bloodSugar: number;

  @IsNotEmpty()
  @IsNumber()
  readonly hemoglobin: number;

  @IsNotEmpty()
  @IsDate()
  readonly date: Date;

  @IsOptional()
  @IsString()
  readonly scanUrl?: string;
}

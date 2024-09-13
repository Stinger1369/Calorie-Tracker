import { IsString, IsEnum } from 'class-validator';

export class ToggleLikeDto {
  @IsString()
  readonly userId: string;

  @IsEnum(['like', 'unlike'], {
    message: 'actionType must be either like or unlike',
  })
  readonly actionType: 'like' | 'unlike';

  @IsEnum(['male', 'female', 'other'], {
    message: 'gender must be male, female, or other',
  })
  readonly gender: 'male' | 'female' | 'other';
}

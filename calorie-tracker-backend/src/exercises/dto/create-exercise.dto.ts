export class CreateExerciseDto {
  readonly userId: string;
  readonly exerciseName: string;
  readonly duration: number;
  readonly caloriesBurned: number;
  readonly date: Date;
}

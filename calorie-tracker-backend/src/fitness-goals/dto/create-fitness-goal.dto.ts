export class CreateFitnessGoalDto {
  readonly userId: string;
  readonly goalName: string;
  readonly target: number;
  readonly progress: number;
  readonly date: Date;
}

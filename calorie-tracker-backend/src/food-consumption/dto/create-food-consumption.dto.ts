export class CreateFoodConsumptionDto {
  readonly userId: string;
  readonly foodName: string;
  readonly calories: number;
  readonly fat: number;
  readonly sugar: number;
  readonly protein: number;
  readonly date: Date;
}

import { CaloriesDTO } from './calories.dto';

export class MacrosDTO {
  protein!: CaloriesDTO;
  fat!: CaloriesDTO;
  carbs!: CaloriesDTO;
}

export interface MacrosRequest {
  protein: number;
  fat: number;
  carbs: number;
}

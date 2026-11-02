import { CaloriesDTO } from './calories.dto';

export class MacrosDTO {
  protein!: CaloriesDTO;
  fat!: CaloriesDTO;
  carbs!: CaloriesDTO;
}

export interface MacroPreference {
  protein: number;
  fat: number;
  carbs: number;
}

export interface MacroQuantity {
  min: number;
  max: number;
}

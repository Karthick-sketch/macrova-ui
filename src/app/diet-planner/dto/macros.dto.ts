import type { CaloriesDTO } from './calories.dto';

export interface MacrosDTO {
  protein: CaloriesDTO;
  fat: CaloriesDTO;
  carbs: CaloriesDTO;
}

export interface Macros {
  protein: number;
  fat: number;
  carbs: number;
}

export interface MacrosPreference {
  balanced: Macros;
  highProtein: Macros;
  lowCarb: Macros;
  lowFat: Macros;
}

export interface MacrosQuantity {
  min: number;
  max: number;
}

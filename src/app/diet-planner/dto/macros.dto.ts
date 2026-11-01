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

export interface MacrosPreference {
  protein: MacrosQuantity;
  fat: MacrosQuantity;
  carbs: MacrosQuantity;
}

export interface MacrosQuantity {
  minimum: number;
  maximum: number;
  recommended: number;
}

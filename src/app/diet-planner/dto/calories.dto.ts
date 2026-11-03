import type { MacrosPreference, MacrosQuantity } from './macros.dto';

export interface CaloriesDTO {
  taken: number;
  total: number;
}

export interface CalorieEstimationResponse {
  tdee: number;
  targetCalories: number;
  proteinQuantity: MacrosQuantity;
  carbsQuantity: MacrosQuantity;
  fatQuantity: MacrosQuantity;
  macrosPreference: MacrosPreference;
}

import type { MacroPreference, MacroQuantity } from './macros.dto';

export class CaloriesDTO {
  taken!: number;
  total!: number;
}

export interface CalorieEstimationResponse {
  tdee: number;
  targetCalories: number;
  proteinQuantity: MacroQuantity;
  carbsQuantity: MacroQuantity;
  fatQuantity: MacroQuantity;
  balanced: MacroPreference;
  highProtein: MacroPreference;
  lowCarb: MacroPreference;
  lowFat: MacroPreference;
}

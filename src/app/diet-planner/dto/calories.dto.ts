import { Goal } from '../enum/goal.enum';
import { MacrosPreference } from './macros.dto';

export class CaloriesDTO {
  taken!: number;
  total!: number;
}

export interface CalorieEstimationDTO {
  tdee: number;
  calorieDeficit: number;
  balanced: MacrosPreference;
  highProtein: MacrosPreference;
  lowCarb: MacrosPreference;
  lowFat: MacrosPreference;
  custom: MacrosPreference;
}

export interface CalorieEstimationRequest {
  tdee: number;
  goal: Goal;
  duration: number;
}

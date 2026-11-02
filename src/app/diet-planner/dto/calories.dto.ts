import { Goal } from '../enum/goal.enum';
import { MacrosQuantity, MacrosRequest } from './macros.dto';

export class CaloriesDTO {
  taken!: number;
  total!: number;
}

export interface CalorieEstimationDTO {
  deficit: number;
  proteinQuantity: MacrosQuantity;
  carbsQuantity: MacrosQuantity;
  fatQuantity: MacrosQuantity;
  balanced: MacrosRequest;
  highProtein: MacrosRequest;
  lowCarb: MacrosRequest;
  lowFat: MacrosRequest;
}

export interface CalorieEstimationRequest {
  tdee: number;
  goal: Goal;
  duration: number;
}

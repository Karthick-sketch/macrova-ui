import type { CaloriesDTO } from './calories.dto';

export interface DietPlanOverviewDTO {
  id: string;
  weight: number;
  tdee: number;
  intake: CaloriesDTO;
  protein: CaloriesDTO;
  carbs: CaloriesDTO;
  fat: CaloriesDTO;
  createdAt: Date;
}

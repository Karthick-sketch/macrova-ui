import type { CaloriesDTO } from './calories.dto';
import type { MealKcalDTO } from './meal-kcal.dto';

export interface DietPlanTrackDTO {
  id: string;
  weight: number;
  tdee: number;
  intake: CaloriesDTO;
  mealKcal: MealKcalDTO;
  createdAt: string;
  dayCount: number;
  dietPlanId: string;
}

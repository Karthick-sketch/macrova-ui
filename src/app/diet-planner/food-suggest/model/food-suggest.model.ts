import type { CaloriesDTO } from '../../dto/calories.dto';
import type { Macros } from '../../dto/macros.dto';

export class FoodSuggestModel {
  name!: string;
  calories!: CaloriesDTO;
  macronutrients!: Macros;
  description!: string;
}

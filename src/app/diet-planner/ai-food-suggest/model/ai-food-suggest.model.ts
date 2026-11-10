import type { CaloriesDTO } from '../../dto/calories.dto';
import type { Macros } from '../../dto/macros.dto';

export class AIFoodSuggestModel {
  name!: string;
  calories!: CaloriesDTO;
  macronutrients!: Macros;
  description!: string;
}

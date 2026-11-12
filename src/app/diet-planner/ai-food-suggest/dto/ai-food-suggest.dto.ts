import type { CaloriesDTO } from '../../dto/calories.dto';
import type { Macros } from '../../dto/macros.dto';

export interface AIFoodSuggest {
  name: string;
  calories: CaloriesDTO;
  macronutrients: Macros;
  description: string;
}

export interface AIFoodSuggestData {
  aiResponseId: string;
  aiFoodSuggests: AIFoodSuggest[];
}

export interface AIFoodSuggestErrorResponse {
  aiResponseId: string;
  errorMessage: string;
}

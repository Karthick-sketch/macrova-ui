import { Component } from '@angular/core';
import { AIFoodSuggestService } from './ai-food-suggest.service';
import type { FilterDto } from './dto/filter.dto';
import type {
  AIFoodSuggest,
  AIFoodSuggestErrorResponse,
  AIFoodSuggestData,
} from './dto/ai-food-suggest.dto';

@Component({
  selector: 'app-ai-food-suggest',
  templateUrl: './ai-food-suggest.component.html',
  styleUrl: './ai-food-suggest.component.css',
})
export class AIFoodSuggestComponent {
  filters = {
    mealFilters: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
    mealTypeFilters: ['Non-vegetarian', 'Vegetarian', 'Eggetarian', 'Vegan'],
    dietTypeFilters: ['Balanced', 'High Protein', 'Low-carb', 'Low-fat'],
    cuisineFilters: ['Indian', 'Chinese', 'Japanese', 'Thai'],
  };
  selected: FilterDto = {
    mealFilter: 'Breakfast',
    mealTypeFilter: 'Non-vegetarian',
    dietTypeFilter: 'Balanced',
    cuisineFilter: 'Indian',
  };

  isLoading = false;
  isError = false;

  aiResponseId: string | null = null;
  aiFoodSuggests: AIFoodSuggest[] = [];

  constructor(private aiFoodSuggestService: AIFoodSuggestService) {}

  addMealFilter(filter: string) {
    this.selected.mealFilter = filter;
  }

  addMealTypeFilter(filter: string) {
    this.selected.mealTypeFilter = filter;
  }

  addDietTypeFilter(filter: string) {
    this.selected.dietTypeFilter = filter;
  }

  addCuisineFilter(filter: string) {
    this.selected.cuisineFilter = filter;
  }

  suggest() {
    this.isLoading = true;
    this.isError = false;
    this.aiFoodSuggestService.suggestFoods(this.selected).subscribe({
      next: (response: AIFoodSuggestData) => {
        this.aiResponseId = response.aiResponseId;
        this.aiFoodSuggests = response.aiFoodSuggests;
        this.isLoading = false;
      },
      error: (error: AIFoodSuggestErrorResponse) => {
        this.aiResponseId = error.aiResponseId;
        this.isLoading = false;
        this.isError = true;
      },
    });
  }

  retry() {
    if (!this.aiResponseId) {
      return;
    }

    this.isLoading = true;
    this.isError = false;
    this.aiFoodSuggestService.retrySuggestFoods(this.aiResponseId).subscribe({
      next: (response: AIFoodSuggestData) => {
        this.aiResponseId = response.aiResponseId;
        this.aiFoodSuggests = response.aiFoodSuggests;
        this.isLoading = false;
      },
      error: (error: AIFoodSuggestErrorResponse) => {
        this.aiResponseId = error.aiResponseId;
        this.isLoading = false;
        this.isError = true;
      },
    });
  }
}

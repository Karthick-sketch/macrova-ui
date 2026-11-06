import { Component } from '@angular/core';
import { AIFoodSuggestModel } from './model/ai-food-suggest.model';
import { AIFoodSuggestService } from './ai-food-suggest.service';
import { FilterDto } from './dto/filter.dto';

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

  aiFoodSuggests!: AIFoodSuggestModel[];

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
      next: (aiFoodSuggestModel: AIFoodSuggestModel[]) => {
        this.aiFoodSuggests = aiFoodSuggestModel;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
      },
    });
  }
}

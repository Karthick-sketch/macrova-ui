import { Component } from '@angular/core';
import { FoodSuggestModel } from './model/food-suggest.model';
import { FoodSuggestService } from './food-suggest.service';
import { FilterDto } from './dto/filter.dto';

@Component({
  selector: 'app-food-suggest',
  templateUrl: './food-suggest.component.html',
  styleUrl: './food-suggest.component.css',
})
export class FoodSuggestComponent {
  filters = {
    mealFilters: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
    mealTypeFilters: ['Non-vegetarian', 'Vegetarian', 'Eggetarian', 'Vegan'],
    dietTypeFilters: ['Balanced', 'High Protein', 'Low-carb', 'Low-fat'],
  };
  selected: FilterDto = {
    mealFilter: 'Breakfast',
    mealTypeFilter: 'Non-vegetarian',
    dietTypeFilter: 'Balanced',
  };
  isLoading = false;
  isError = false;

  foodSuggests!: FoodSuggestModel[];

  constructor(private foodSuggestService: FoodSuggestService) {}

  addMealFilter(filter: string) {
    this.selected.mealFilter = filter;
  }

  addMealTypeFilter(filter: string) {
    this.selected.mealTypeFilter = filter;
  }

  addDietTypeFilter(filter: string) {
    this.selected.dietTypeFilter = filter;
  }

  suggest() {
    this.isLoading = true;
    this.isError = false;
    this.foodSuggestService.suggestFoods(this.selected).subscribe({
      next: (foodSuggestModel: FoodSuggestModel[]) => {
        this.foodSuggests = foodSuggestModel;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
      },
    });
  }
}

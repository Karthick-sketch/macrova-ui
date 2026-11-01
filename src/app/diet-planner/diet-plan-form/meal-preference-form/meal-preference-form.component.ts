import {
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { DietPlanService } from '../../diet-plan-service';
import { Option } from '../../../shared/model/option.model';
import type { MealPreferenceRequest } from '../../dto/diet-plan.dto';
import type { MacrosPreference } from '../../dto/macros.dto';
import type { CalorieEstimationDTO } from '../../dto/calories.dto';

@Component({
  selector: 'app-meal-preference-form',
  templateUrl: './meal-preference-form.component.html',
  styleUrl: './meal-preference-form.component.css',
  imports: [FormsModule, DecimalPipe],
})
export class MealPreferenceFormComponent implements OnInit {
  calorieEstimation = input.required<CalorieEstimationDTO>();

  mealPreferenceEvent = output<MealPreferenceRequest>();

  macroPreferenceType = signal<string>('balanced');

  macroPreferenceTypes: Option[] = [
    new Option('balanced', 'Balanced'),
    new Option('balanced', 'Balanced'),
    new Option('highProtein', 'High Protein'),
    new Option('lowCarb', 'Low Carb'),
    new Option('lowFat', 'Low Fat'),
    new Option('custom', 'Custom'),
  ];
  mealTypes: Option[] = [
    new Option('nonVegetarian', 'Non-Vegetarian'),
    new Option('vegetarian', 'Vegetarian'),
    new Option('eggetarian', 'Eggetarian'),
    new Option('vegan', 'Vegan'),
  ];
  mealCounts: number[] = [2, 3, 4, 5];

  constructor(
    private router: Router,
    private dietPlanService: DietPlanService,
  ) {}

  mealPreference = computed<MealPreferenceRequest>(() => ({
    type: this.macroPreferenceType(),
    calorieEstimation: this.calorieEstimation(),
    mealType: 'non-vegetarian',
    numberOfMeals: 3,
    eveningSnack: true,
  }));

  macrosPreference = computed<MacrosPreference>(() => {
    const est = this.calorieEstimation();
    const type = this.macroPreferenceType();

    const targetMacros = est[type as keyof CalorieEstimationDTO];

    // Check if targetMacros exists AND is an object (not a primitive number)
    if (
      targetMacros &&
      typeof targetMacros === 'object' &&
      'protein' in targetMacros
    ) {
      return {
        protein: targetMacros.protein,
        carbs: targetMacros.carbs,
        fat: targetMacros.fat,
      };
    }

    // Fallback if 'type' points to a primitive property or doesn't exist
    return {
      protein: { minimum: 0, maximum: 0, recommended: 0 },
      carbs: { minimum: 0, maximum: 0, recommended: 0 },
      fat: { minimum: 0, maximum: 0, recommended: 0 },
    };
  });

  ngOnInit() {
    this.dietPlanService.isThereAnyActivePlans().subscribe((value) => {
      if (value) {
        this.router.navigate(['/']);
      }
    });
  }

  changeType(key: string) {
    this.mealPreference().type = key;
    this.macroPreferenceType.set(key);
  }

  setProteinPreference(value: string) {
    this.mealPreference().calorieEstimation.custom.protein.recommended =
      Number(value);
  }

  setCarbsPreference(value: string) {
    this.mealPreference().calorieEstimation.custom.carbs.recommended =
      Number(value);
  }

  setFatPreference(value: string) {
    this.mealPreference().calorieEstimation.custom.fat.recommended =
      Number(value);
  }

  submitMealPreferences() {
    this.mealPreferenceEvent.emit(this.mealPreference());
  }

  selectSnack(snack: boolean) {
    this.mealPreference().eveningSnack = snack;
  }

  selectMealType(mealType: string) {
    this.mealPreference().mealType = mealType;
  }

  selectNumberOfMeals(numberOfMeals: number) {
    this.mealPreference().numberOfMeals = numberOfMeals;
  }
}

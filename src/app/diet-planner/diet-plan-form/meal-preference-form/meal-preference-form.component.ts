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
import type { CalorieEstimationDTO } from '../../dto/calories.dto';
import type { MacrosQuantity, MacrosRequest } from '../../dto/macros.dto';

@Component({
  selector: 'app-meal-preference-form',
  templateUrl: './meal-preference-form.component.html',
  styleUrl: './meal-preference-form.component.css',
  imports: [FormsModule, DecimalPipe],
})
export class MealPreferenceFormComponent implements OnInit {
  calorieEstimation = input.required<CalorieEstimationDTO>();
  tdee = input.required<number>();

  mealPreferenceEvent = output<MealPreferenceRequest>();

  macroPreferenceType = signal<string>('balanced');

  macroPreferenceTypes: Option[] = [
    new Option('balanced', 'Balanced'),
    new Option('highProtein', 'High Protein'),
    new Option('lowCarb', 'Low Carb'),
    new Option('lowFat', 'Low Fat'),
    new Option('custom', 'Custom'),
  ];
  mealTypes: Option[] = [
    new Option('non-vegetarian', 'Non-Vegetarian'),
    new Option('vegetarian', 'Vegetarian'),
    new Option('eggetarian', 'Eggetarian'),
    new Option('vegan', 'Vegan'),
  ];
  mealCounts: number[] = [2, 3, 4, 5];

  constructor(
    private router: Router,
    private dietPlanService: DietPlanService,
  ) {}

  macroPreference = computed<MacrosRequest>(() => {
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
      protein: this.findMiddleValue(this.calorieEstimation().proteinQuantity),
      carbs: this.findMiddleValue(this.calorieEstimation().carbsQuantity),
      fat: this.findMiddleValue(this.calorieEstimation().fatQuantity),
    };
  });

  mealPreference = computed<MealPreferenceRequest>(() => ({
    type: this.macroPreferenceType(),
    macroPreference: this.macroPreference(),
    dietType: this.macroPreferenceType(),
    mealType: 'non-vegetarian',
    numberOfMeals: 3,
    eveningSnack: true,
  }));

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
    this.mealPreference().macroPreference.protein = Number(value);
  }

  setCarbsPreference(value: string) {
    this.mealPreference().macroPreference.carbs = Number(value);
  }

  setFatPreference(value: string) {
    this.mealPreference().macroPreference.fat = Number(value);
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

  private findMiddleValue(qty: MacrosQuantity): number {
    return (qty.min + qty.max) / 2;
  }
}

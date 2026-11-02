import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Option } from '../../../shared/model/option.model';
import type { MealPreferenceRequest } from '../../dto/diet-plan.dto';
import type { CalorieEstimationResponse } from '../../dto/calories.dto';
import type { MacroPreference, MacroQuantity } from '../../dto/macros.dto';

@Component({
  selector: 'app-meal-preference-form',
  templateUrl: './meal-preference-form.component.html',
  styleUrl: './meal-preference-form.component.css',
  imports: [FormsModule, DecimalPipe],
})
export class MealPreferenceFormComponent {
  calorieEstimation = input.required<CalorieEstimationResponse>();
  tdee = input.required<number>();

  mealPreferenceEvent = output<MealPreferenceRequest>();

  // Signals for all mutable state
  macroPreferenceType = signal<string>('balanced');
  selectedMealType = signal<string>('non-vegetarian');
  numberOfMeals = signal<number>(3);
  eveningSnack = signal<boolean>(true);
  customProtein = signal<number | null>(null);
  customCarbs = signal<number | null>(null);
  customFat = signal<number | null>(null);

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

  macroPreference = computed<MacroPreference>(() => {
    const est = this.calorieEstimation();
    const type = this.macroPreferenceType();

    if (type === 'custom') {
      return {
        protein:
          this.customProtein() ?? this.findMiddleValue(est.proteinQuantity),
        carbs: this.customCarbs() ?? this.findMiddleValue(est.carbsQuantity),
        fat: this.customFat() ?? this.findMiddleValue(est.fatQuantity),
      };
    }

    const targetMacros = est[type as keyof CalorieEstimationResponse];
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

    return {
      protein: this.findMiddleValue(est.proteinQuantity),
      carbs: this.findMiddleValue(est.carbsQuantity),
      fat: this.findMiddleValue(est.fatQuantity),
    };
  });

  changeType(key: string) {
    this.macroPreferenceType.set(key);
    // Reset custom overrides when switching away from custom
    if (key !== 'custom') {
      this.customProtein.set(null);
      this.customCarbs.set(null);
      this.customFat.set(null);
    }
  }

  setProteinPreference(value: string) {
    this.customProtein.set(Number(value));
    if (this.macroPreferenceType() !== 'custom') {
      this.macroPreferenceType.set('custom');
    }
  }

  setCarbsPreference(value: string) {
    this.customCarbs.set(Number(value));
    if (this.macroPreferenceType() !== 'custom') {
      this.macroPreferenceType.set('custom');
    }
  }

  setFatPreference(value: string) {
    this.customFat.set(Number(value));
    if (this.macroPreferenceType() !== 'custom') {
      this.macroPreferenceType.set('custom');
    }
  }

  submitMealPreferences() {
    this.mealPreferenceEvent.emit({
      macroPreference: this.macroPreference(),
      dietType: this.macroPreferenceType(),
      mealType: this.selectedMealType(),
      numberOfMeals: this.numberOfMeals(),
      eveningSnack: this.eveningSnack(),
    });
  }

  selectSnack(snack: boolean) {
    this.eveningSnack.set(snack);
  }

  selectMealType(mealType: string) {
    this.selectedMealType.set(mealType);
  }

  selectNumberOfMeals(count: number) {
    this.numberOfMeals.set(count);
  }

  private findMiddleValue(qty: MacroQuantity): number {
    return Math.round((qty.min + qty.max) / 2);
  }
}

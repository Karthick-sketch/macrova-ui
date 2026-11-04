import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { DietPlanService } from '../../diet-plan-service';
import { DietType } from '../../enum/diet-type.enum';
import { MealType } from '../../enum/meal-type.enum';
import { Option } from '../../../shared/model/option.model';
import type {
  DietPlanDTO,
  MealPreferenceRequest,
} from '../../dto/diet-plan.dto';
import type { CalorieEstimationResponse } from '../../dto/calories.dto';
import type { Macros, MacrosQuantity } from '../../dto/macros.dto';

@Component({
  selector: 'app-meal-preference-form',
  templateUrl: './meal-preference-form.component.html',
  styleUrl: './meal-preference-form.component.css',
  imports: [FormsModule, DecimalPipe],
})
export class MealPreferenceFormComponent implements OnInit {
  calorieEstimation = input.required<CalorieEstimationResponse>();

  mealPreferenceEvent = output<DietPlanDTO>();

  mealPreference = signal<MealPreferenceRequest>({
    currentCalories: 0,
    macros: { protein: 0, carbs: 0, fat: 0 },
    dietType: DietType.BALANCED,
    mealType: MealType.NON_VEGETARIAN,
    mealCount: 3,
    eveningSnack: true,
  });

  dietTypes: Option<DietType>[] = [
    new Option('Balanced', DietType.BALANCED),
    new Option('High Protein', DietType.HIGH_PROTEIN),
    new Option('Low Carb', DietType.LOW_CARB),
    new Option('Low Fat', DietType.LOW_FAT),
    new Option('Custom', DietType.CUSTOM),
  ];
  mealTypes: Option<MealType>[] = [
    new Option('Non-Vegetarian', MealType.NON_VEGETARIAN),
    new Option('Vegetarian', MealType.VEGETARIAN),
    new Option('Eggetarian', MealType.EGGETARIAN),
    new Option('Vegan', MealType.VEGAN),
  ];
  mealCounts: number[] = [2, 3, 4, 5];

  constructor(private dietPlanService: DietPlanService) {}

  ngOnInit(): void {
    this.mealPreference.update((prev) => ({
      ...prev,
      macros: this.getMacros(prev.dietType),
    }));
    this.calculateCalories();
  }

  changeType(type: DietType) {
    this.mealPreference.update((prev) => ({
      ...prev,
      dietType: type,
      macros: this.getMacros(type),
    }));
    this.calculateCalories();
  }

  setProteinPreference(value: number | string) {
    this.mealPreference.update((prev) => ({
      ...prev,
      dietType: DietType.CUSTOM,
      macros: { ...prev.macros, protein: Number(value) },
    }));
    this.calculateCalories();
  }

  setCarbsPreference(value: number | string) {
    this.mealPreference.update((prev) => ({
      ...prev,
      dietType: DietType.CUSTOM,
      macros: { ...prev.macros, carbs: Number(value) },
    }));
    this.calculateCalories();
  }

  setFatPreference(value: number | string) {
    this.mealPreference.update((prev) => ({
      ...prev,
      dietType: DietType.CUSTOM,
      macros: { ...prev.macros, fat: Number(value) },
    }));
    this.calculateCalories();
  }

  submitMealPreferences() {
    this.dietPlanService
      .createDietPlanMealPreference(this.mealPreference())
      .subscribe((dietPlanDTO: DietPlanDTO) =>
        this.mealPreferenceEvent.emit(dietPlanDTO),
      );
  }

  selectSnack(snack: boolean) {
    this.mealPreference.update((prev) => ({ ...prev, eveningSnack: snack }));
  }

  selectMealType(mealType: MealType) {
    this.mealPreference.update((prev) => ({ ...prev, mealType }));
  }

  selectMealCount(count: number) {
    this.mealPreference.update((prev) => ({ ...prev, mealCount: count }));
  }

  private calculateCalories() {
    const macros = this.mealPreference().macros;
    const calories = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
    this.mealPreference.update((prev) => ({
      ...prev,
      currentCalories: calories,
    }));
  }

  private getMacros(dietType: DietType): Macros {
    const est = this.calorieEstimation();
    switch (dietType) {
      case DietType.BALANCED:
        return est.macrosPreference.balanced;
      case DietType.HIGH_PROTEIN:
        return est.macrosPreference.highProtein;
      case DietType.LOW_CARB:
        return est.macrosPreference.lowCarb;
      case DietType.LOW_FAT:
        return est.macrosPreference.lowFat;
      default:
        return {
          protein:
            this.mealPreference().macros.protein ??
            this.findMiddleValue(est.proteinQuantity),
          carbs:
            this.mealPreference().macros.carbs ??
            this.findMiddleValue(est.carbsQuantity),
          fat:
            this.mealPreference().macros.fat ??
            this.findMiddleValue(est.fatQuantity),
        };
    }
  }

  private findMiddleValue(qty: MacrosQuantity): number {
    return Math.round((qty.min + qty.max) / 2);
  }
}

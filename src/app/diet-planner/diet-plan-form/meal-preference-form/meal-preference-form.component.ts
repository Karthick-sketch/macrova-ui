import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { DietPlanService } from '../../diet-plan-service';
import { DietTypes } from '../../enum/diet-types.enum';
import { MealTypes } from '../../enum/meal-types.enum';
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
export class MealPreferenceFormComponent {
  calorieEstimation = input.required<CalorieEstimationResponse>();

  mealPreferenceEvent = output<DietPlanDTO>();

  mealPreference = signal<MealPreferenceRequest>({
    macros: { protein: 0, carbs: 0, fat: 0 },
    dietType: DietTypes.BALANCED,
    mealType: MealTypes.NON_VEGETARIAN,
    mealCount: 3,
    eveningSnack: true,
  });

  dietTypes: Option<DietTypes>[] = [
    new Option('Balanced', DietTypes.BALANCED),
    new Option('High Protein', DietTypes.HIGH_PROTEIN),
    new Option('Low Carb', DietTypes.LOW_CARB),
    new Option('Low Fat', DietTypes.LOW_FAT),
    new Option('Custom', DietTypes.CUSTOM),
  ];
  mealTypes: Option<MealTypes>[] = [
    new Option('Non-Vegetarian', MealTypes.NON_VEGETARIAN),
    new Option('Vegetarian', MealTypes.VEGETARIAN),
    new Option('Eggetarian', MealTypes.EGGETARIAN),
    new Option('Vegan', MealTypes.VEGAN),
  ];
  mealCounts: number[] = [2, 3, 4, 5];

  // Computed macros based on diet type
  macros = computed<Macros>(() => {
    const dietType = this.mealPreference().dietType;
    const est = this.calorieEstimation();
    const macrosPreference = est.macrosPreference;

    switch (dietType) {
      case DietTypes.BALANCED:
        return macrosPreference.balanced;
      case DietTypes.HIGH_PROTEIN:
        return macrosPreference.highProtein;
      case DietTypes.LOW_CARB:
        return macrosPreference.lowCarb;
      case DietTypes.LOW_FAT:
        return macrosPreference.lowFat;
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
  });

  constructor(private dietPlanService: DietPlanService) {}

  changeType(type: DietTypes) {
    this.mealPreference().dietType = type;
    // Reset custom overrides when switching away from custom
    if (type !== DietTypes.CUSTOM) {
      this.mealPreference().macros.protein = 0;
      this.mealPreference().macros.carbs = 0;
      this.mealPreference().macros.fat = 0;
    }
  }

  setProteinPreference(value: string) {
    this.mealPreference().macros.protein = Number(value);
    this.setDietTypeCustom();
  }

  setCarbsPreference(value: string) {
    this.mealPreference().macros.carbs = Number(value);
    this.setDietTypeCustom();
  }

  setFatPreference(value: string) {
    this.mealPreference().macros.fat = Number(value);
    this.setDietTypeCustom();
  }

  submitMealPreferences() {
    this.dietPlanService
      .createDietPlanMealPreference(this.mealPreference())
      .subscribe((dietPlanDTO: DietPlanDTO) =>
        this.mealPreferenceEvent.emit(dietPlanDTO),
      );
  }

  selectSnack(snack: boolean) {
    this.mealPreference().eveningSnack = snack;
  }

  selectMealType(mealType: MealTypes) {
    this.mealPreference().mealType = mealType;
  }

  selectMealCount(count: number) {
    this.mealPreference().mealCount = count;
  }

  private findMiddleValue(qty: MacrosQuantity): number {
    return Math.round((qty.min + qty.max) / 2);
  }

  private setDietTypeCustom() {
    if (this.mealPreference().dietType !== DietTypes.CUSTOM) {
      this.mealPreference().dietType = DietTypes.CUSTOM;
    }
  }
}

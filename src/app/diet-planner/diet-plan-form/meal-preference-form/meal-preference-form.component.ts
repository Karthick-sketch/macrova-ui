import { Component, computed, input, OnInit, output, signal, Signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { DietPlanService } from '../../diet-plan-service';
import { ToastComponent } from '../../../toast/toast.component';
import { DropdownModel } from '../../../shared/model/dropdown.model';
import type { DietPlanDTO, MealPreferenceRequest } from '../../dto/diet-plan.dto';
import type { MacrosPreference } from '../../dto/macros.dto';
import type { CalorieEstimationDTO } from '../../dto/calories.dto';

@Component({
  selector: 'app-meal-preference-form',
  templateUrl: './meal-preference-form.component.html',
  styleUrl: './meal-preference-form.component.css',
  imports: [FormsModule, DecimalPipe, ToastComponent],
})
export class MealPreferenceFormComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  calorieEstimation = input.required<CalorieEstimationDTO>();

  mealPreferenceEvent = output<MealPreferenceRequest>();

  macroPreferenceTypes: DropdownModel[] = [
    new DropdownModel('balanced', 'Balanced'),
    new DropdownModel('high-protein', 'High Protein'),
    new DropdownModel('low-carb', 'Low Carb'),
    new DropdownModel('low-fat', 'Low Fat'),
    new DropdownModel('custom', 'Custom'),
  ];
  macroPreferenceType = signal<string>('balanced');

  mealTypes: DropdownModel[] = [
    new DropdownModel('non-vegetarian', 'Non-Vegetarian'),
    new DropdownModel('vegetarian', 'Vegetarian'),
    new DropdownModel('eggetarian', 'Eggetarian'),
    new DropdownModel('vegan', 'Vegan'),
  ];
  mealCounts: number[] = [2, 3, 4, 5];

  dietPlanId: string | null = null;

  constructor(
    private router: Router,
    private dietPlanService: DietPlanService,
  ) {
    // this.dietPlanDTO = new DietPlanDTO();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.dietPlanId = navigation.extras.state['pastPlanId'];
    }
  }

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

    if (type === "high-protein") {
      return {
        protein: est.highProtein.protein,
        carbs: est.highProtein.carbs,
        fat: est.highProtein.fat,
      }
    } else if (type === "low-carb") {
      return {
        protein: est.lowCarb.protein,
        carbs: est.lowCarb.carbs,
        fat: est.lowCarb.fat,
      }
    } else if (type === "low-fat") {
      return {
        protein: est.lowFat.protein,
        carbs: est.lowFat.carbs,
        fat: est.lowFat.fat,
      }
    } else if (type === "custom") {
      return {
        protein: est.custom.protein,
        carbs: est.custom.carbs,
        fat: est.custom.fat,
      }
    }

    return {
      protein: est.balanced.protein,
      carbs: est.balanced.carbs,
      fat: est.balanced.fat,
    }
  });

  ngOnInit() {
    this.dietPlanService.isThereAnyActivePlans().subscribe((value) => {
      if (value) {
        this.router.navigate(['/']);
      } else if (this.dietPlanId) {
        this.dietPlanService.getDietPlanById(this.dietPlanId).subscribe({
          next: (dietPlanDTO: DietPlanDTO) => {
            // this.dietPlanDTO = dietPlanDTO;
          },
          error: ({ status, error }) => {
            if (status === 404) {
              this.toast.showError(error.error[0]);
            }
          },
        });
      }
    });
  }

  changeType(key: string) {
    this.mealPreference().type = key;
    this.macroPreferenceType.set(key);
  }

  setProteinPreference(value: string) {
    this.mealPreference().calorieEstimation.custom.protein.recommended = Number(value);
  }

  setCarbsPreference(value: string) {
    this.mealPreference().calorieEstimation.custom.carbs.recommended = Number(value);
  }

  setFatPreference(value: string) {
    this.mealPreference().calorieEstimation.custom.fat.recommended = Number(value);
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

  // updateDietPlan() {
  //   this.dietPlanService.updateDietPlan(this.dietPlanDTO).subscribe({
  //     next: () => {
  //       this.router.navigate(['/']);
  //     },
  //     error: ({ status, error }) => {
  //       if (status === 400) {
  //         this.toast.showError(error.error[0]);
  //       }
  //     },
  //   });
  // }
}

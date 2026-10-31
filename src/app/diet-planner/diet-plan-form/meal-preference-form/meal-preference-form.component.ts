import { Component, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DietPlanService } from '../../diet-plan-service';
import type { DietPlanDTO, MealPreferenceRequest } from '../../dto/diet-plan.dto';
import { ToastComponent } from '../../../toast/toast.component';
import { MacrosRequest } from '../../dto/macros.dto';
import { DropdownModel } from '../../../shared/model/dropdown.model';

@Component({
  selector: 'app-meal-preference-form',
  templateUrl: './meal-preference-form.component.html',
  styleUrl: './meal-preference-form.component.css',
  imports: [FormsModule, ToastComponent],
})
export class MealPreferenceFormComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  mealPreferenceEvent = output<MealPreferenceRequest>();

  mealTypes: DropdownModel[] = [
    new DropdownModel('non-vegetarian', 'Non-Vegetarian'),
    new DropdownModel('vegetarian', 'Vegetarian'),
    new DropdownModel('eggetarian', 'Eggetarian'),
    new DropdownModel('vegan', 'Vegan'),
  ];
  mealCounts: number[] = [2, 3, 4, 5];
  macros: MacrosRequest = { protein: 0, fat: 0, carbs: 0 }

  mealPreference: MealPreferenceRequest = {
    macronutrientPreference: this.macros,
    mealPreference: 'non-vegetarian',
    numberOfMeals: 3,
    eveningSnack: false,
  };

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

  submitMealPreferences() {
    this.mealPreferenceEvent.emit(this.mealPreference);
  }

  selectSnack(snack: boolean) {
    this.mealPreference.eveningSnack = snack;
  }

  selectMealType(mealType: string) {
    this.mealPreference.mealPreference = mealType;
  }

  selectNumberOfMeals(numberOfMeals: number) {
    this.mealPreference.numberOfMeals = numberOfMeals;
  }

  selectMacronutrientPreference(macronutrientPreference: MacrosRequest) {
    this.mealPreference.macronutrientPreference = macronutrientPreference;
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

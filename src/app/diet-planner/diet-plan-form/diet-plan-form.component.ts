import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DietPlanService } from '../diet-plan-service';
import { BodyMetricsResponse, DietPlanDTO, GoalSectionRequest, MealPreferenceRequest } from '../dto/diet-plan.dto';
import { ToastComponent } from '../../toast/toast.component';
import { PlanStatus } from '../enum/plan-status';
import { BodyMetricsFormComponent } from './body-metrics-form/body-metrics-form.component';
import { DietPlanPreviewFormComponent } from './diet-plan-preview-form/diet-plan-preview-form.component';
import { GoalSelectionFormComponent } from './goal-selection-form/goal-selection-form.component';
import { MealPreferenceFormComponent } from './meal-preference-form/meal-preference-form.component';
import { CalorieEstimationDTO } from '../dto/calories.dto';

@Component({
  selector: 'app-diet-plan-form',
  templateUrl: './diet-plan-form.component.html',
  styleUrl: './diet-plan-form.component.css',
  imports: [
    ToastComponent,
    BodyMetricsFormComponent,
    DietPlanPreviewFormComponent,
    GoalSelectionFormComponent,
    MealPreferenceFormComponent,
  ],
})
export class DietPlanFormComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  calorieEstimation: CalorieEstimationDTO =
    {
      tdee: 2500, calorieDeficit: 2000,
      balanced: {
        protein: { minimum: 100, maximum: 200, recommended: 140 },
        carbs: { minimum: 200, maximum: 300, recommended: 250 },
        fat: { minimum: 50, maximum: 100, recommended: 75 },
      },
      highProtein: {
        protein: { minimum: 100, maximum: 200, recommended: 140 },
        carbs: { minimum: 200, maximum: 300, recommended: 250 },
        fat: { minimum: 50, maximum: 100, recommended: 75 },
      },
      lowCarb: {
        protein: { minimum: 100, maximum: 200, recommended: 140 },
        carbs: { minimum: 200, maximum: 300, recommended: 250 },
        fat: { minimum: 50, maximum: 100, recommended: 75 },
      },
      lowFat: {
        protein: { minimum: 100, maximum: 200, recommended: 140 },
        carbs: { minimum: 200, maximum: 300, recommended: 250 },
        fat: { minimum: 50, maximum: 100, recommended: 75 },
      },
      custom: {
        protein: { minimum: 100, maximum: 200, recommended: 140 },
        carbs: { minimum: 200, maximum: 300, recommended: 250 },
        fat: { minimum: 50, maximum: 100, recommended: 75 },
      },
    };

  dietPlanDTO = {} as DietPlanDTO;
  dietPlanId: string | null = null;

  planStatus = PlanStatus;
  currentPlanStatus: PlanStatus = PlanStatus.BODY_METRICS;

  constructor(
    private router: Router,
    private dietPlanService: DietPlanService,
  ) {
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
            this.dietPlanDTO = dietPlanDTO;
            // TODO: update current stage based on which form is not submitted
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

  onBmrReceived($event: BodyMetricsResponse) {
    this.dietPlanDTO.title = $event.title;
    this.dietPlanDTO.age = $event.age;
    this.dietPlanDTO.gender = $event.gender;
    this.dietPlanDTO.height = $event.height;
    this.dietPlanDTO.weight = $event.weight;
    this.dietPlanDTO.targetWeight = $event.targetWeight;
    this.dietPlanDTO.activity = $event.activity;
    this.calorieEstimation = $event.calorieEstimation;
    this.currentPlanStatus = PlanStatus.PLAN_SELECTION;
  }

  onGoalSelected($event: GoalSectionRequest) {
    this.dietPlanDTO.goal = $event.goal;
    this.dietPlanDTO.duration = $event.duration;
    this.currentPlanStatus = PlanStatus.MEAL_PREFERENCE;
  }

  onMealPreference($event: MealPreferenceRequest) {
    this.dietPlanDTO.macronutrientPreference = {
      protein: $event.calorieEstimation.custom.protein.recommended,
      carbs: $event.calorieEstimation.custom.carbs.recommended,
      fat: $event.calorieEstimation.custom.fat.recommended,
    }
    this.dietPlanDTO.mealType = $event.mealType;
    this.dietPlanDTO.numberOfMeals = $event.numberOfMeals;
    this.dietPlanDTO.eveningSnack = $event.eveningSnack;
    this.currentPlanStatus = PlanStatus.PREVIEW;
  }
}

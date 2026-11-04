import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DietPlanService } from '../diet-plan-service';
import { BodyMetricsFormComponent } from './body-metrics-form/body-metrics-form.component';
import { DietPlanPreviewFormComponent } from './diet-plan-preview-form/diet-plan-preview-form.component';
import { GoalSelectionFormComponent } from './goal-selection-form/goal-selection-form.component';
import { MealPreferenceFormComponent } from './meal-preference-form/meal-preference-form.component';
import { Activity } from '../enum/activity.enum';
import { FormStatus } from '../enum/form-status.enum';
import { Gender } from '../enum/gender.enum';
import { Plan } from '../enum/plan.enum';
import { PlanStatus } from '../enum/plan-status.enum';
import type {
  BodyMetricsRequest,
  BodyMetricsResponse,
  DietPlanDTO,
  DietPlanFormStatus,
} from '../dto/diet-plan.dto';
import type { CalorieEstimationResponse } from '../dto/calories.dto';

@Component({
  selector: 'app-diet-plan-form',
  templateUrl: './diet-plan-form.component.html',
  styleUrl: './diet-plan-form.component.css',
  imports: [
    BodyMetricsFormComponent,
    DietPlanPreviewFormComponent,
    GoalSelectionFormComponent,
    MealPreferenceFormComponent,
  ],
})
export class DietPlanFormComponent implements OnInit {
  dietPlanDTO = {} as DietPlanDTO;
  bodyMetricsResponse = {} as BodyMetricsResponse;
  calorieEstimationResponse = {} as CalorieEstimationResponse;

  formStatus = FormStatus;
  currentFormStatus: FormStatus = FormStatus.BODY_METRICS;

  bodyMetricsRequest: BodyMetricsRequest = {
    title: '',
    plan: Plan.WEIGHT_LOSS,
    age: 25,
    gender: Gender.MALE,
    height: 175,
    weight: 100,
    targetWeight: 75,
    activity: Activity.SEDENTARY,
  };

  steps = ['Body Metrics', 'Goal & Duration', 'Meal Preferences', 'Preview'];

  get stepIndex(): number {
    const order = [
      FormStatus.BODY_METRICS,
      FormStatus.GOAL_SELECTION,
      FormStatus.MEAL_PREFERENCE,
      FormStatus.PREVIEW,
    ];
    return order.indexOf(this.currentFormStatus);
  }

  constructor(
    private router: Router,
    private dietPlanService: DietPlanService,
  ) {}

  ngOnInit() {
    this.dietPlanService.getDietPlanFormStatus().subscribe((response) => {
      this.getDietPlanForm(response.formStatus, response);
    });
  }

  goBack() {
    const order = [
      FormStatus.BODY_METRICS,
      FormStatus.GOAL_SELECTION,
      FormStatus.MEAL_PREFERENCE,
      FormStatus.PREVIEW,
    ];
    const idx = order.indexOf(this.currentFormStatus);
    if (idx > 0) {
      const status = order[idx - 1];
      this.dietPlanService
        .fetchDietPlanFormDetails(status)
        .subscribe((response) => {
          this.currentFormStatus = status;
          this.getDietPlanForm(this.currentFormStatus, response);
        });
    }
  }

  private getDietPlanForm(status: FormStatus, response: DietPlanFormStatus) {
    if (response.planStatus === PlanStatus.ACTIVE) {
      this.router.navigate(['/']);
    } else if (status === FormStatus.BODY_METRICS) {
      if (response.bodyMetricsRequest) {
        this.bodyMetricsRequest = response.bodyMetricsRequest;
      }
      this.currentFormStatus = FormStatus.BODY_METRICS;
    } else if (status === FormStatus.GOAL_SELECTION) {
      if (response.bodyMetricsResponse) {
        this.bodyMetricsResponse = response.bodyMetricsResponse;
      }
      this.currentFormStatus = FormStatus.GOAL_SELECTION;
    } else if (status === FormStatus.MEAL_PREFERENCE) {
      if (response.caloriesEstimation) {
        this.calorieEstimationResponse = response.caloriesEstimation;
      }
      this.currentFormStatus = FormStatus.MEAL_PREFERENCE;
    } else if (status === FormStatus.PREVIEW) {
      if (response.dietPlan) {
        this.dietPlanDTO = response.dietPlan;
      }
      this.currentFormStatus = FormStatus.PREVIEW;
    }
  }

  onBodyMetricsReceived($event: BodyMetricsResponse) {
    this.bodyMetricsResponse = $event;
    this.currentFormStatus = FormStatus.GOAL_SELECTION;
  }

  onGoalSelected($event: CalorieEstimationResponse) {
    this.calorieEstimationResponse = $event;
    this.currentFormStatus = FormStatus.MEAL_PREFERENCE;
  }

  onMealPreference($event: DietPlanDTO) {
    this.dietPlanDTO = $event;
    this.currentFormStatus = FormStatus.PREVIEW;
  }

  createDietPlan($event: DietPlanDTO) {
    this.router.navigate(['/']);
  }
}

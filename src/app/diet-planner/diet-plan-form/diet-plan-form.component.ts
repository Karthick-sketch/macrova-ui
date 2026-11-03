import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DietPlanService } from '../diet-plan-service';
import { BodyMetricsFormComponent } from './body-metrics-form/body-metrics-form.component';
import { DietPlanPreviewFormComponent } from './diet-plan-preview-form/diet-plan-preview-form.component';
import { GoalSelectionFormComponent } from './goal-selection-form/goal-selection-form.component';
import { MealPreferenceFormComponent } from './meal-preference-form/meal-preference-form.component';
import { ToastComponent } from '../../toast/toast.component';
import { FormStatus } from '../enum/form-status.enum';
import { PlanStatus } from '../enum/plan-status.enum';
import type { BodyMetricsResponse, DietPlanDTO } from '../dto/diet-plan.dto';
import type { CalorieEstimationResponse } from '../dto/calories.dto';

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

  dietPlanId: string | null = null;
  dietPlanDTO = {} as DietPlanDTO;
  bodyMetricsResponse = {} as BodyMetricsResponse;
  calorieEstimationResponse = {} as CalorieEstimationResponse;

  formStatus = FormStatus;
  currentFormStatus: FormStatus = FormStatus.BODY_METRICS;

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
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.dietPlanId = navigation.extras.state['pastPlanId'];
    }
  }

  ngOnInit() {
    this.dietPlanService.getDietPlanFormStatus().subscribe((value) => {
      if (value.planStatus === PlanStatus.ACTIVE) {
        this.router.navigate(['/']);
      } else if (value.formStatus === FormStatus.GOAL_SELECTION) {
        if (value.bodyMetrics) {
          this.bodyMetricsResponse = value.bodyMetrics;
        }
        this.currentFormStatus = FormStatus.GOAL_SELECTION;
      } else if (value.formStatus === FormStatus.MEAL_PREFERENCE) {
        if (value.caloriesEstimation) {
          this.calorieEstimationResponse = value.caloriesEstimation;
        }
        this.currentFormStatus = FormStatus.MEAL_PREFERENCE;
      } else if (value.formStatus === FormStatus.PREVIEW) {
        if (value.dietPlan) {
          this.dietPlanDTO = value.dietPlan;
        }
        this.currentFormStatus = FormStatus.PREVIEW;
      }
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
      this.currentFormStatus = order[idx - 1];
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
    this.router.navigate(['/diet-plan', $event.id]);
  }
}

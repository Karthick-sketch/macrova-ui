import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DietPlanService } from '../diet-plan-service';
import { BodyMetricsFormComponent } from './body-metrics-form/body-metrics-form.component';
import { DietPlanPreviewFormComponent } from './diet-plan-preview-form/diet-plan-preview-form.component';
import { GoalSelectionFormComponent } from './goal-selection-form/goal-selection-form.component';
import { MealPreferenceFormComponent } from './meal-preference-form/meal-preference-form.component';
import { ToastComponent } from '../../toast/toast.component';
import { PlanStatus } from '../enum/plan-status';
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

  planStatus = PlanStatus;
  currentPlanStatus: PlanStatus = PlanStatus.BODY_METRICS;

  steps = ['Body Metrics', 'Goal & Duration', 'Meal Preferences', 'Preview'];

  get stepIndex(): number {
    const order = [
      PlanStatus.BODY_METRICS,
      PlanStatus.PLAN_SELECTION,
      PlanStatus.MEAL_PREFERENCE,
      PlanStatus.PREVIEW,
    ];
    return order.indexOf(this.currentPlanStatus);
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
    this.dietPlanService.isThereAnyActivePlans().subscribe((value) => {
      if (value) {
        this.router.navigate(['/']);
      } else if (this.dietPlanId) {
        this.dietPlanService.getDietPlanById(this.dietPlanId).subscribe({
          next: (dietPlanDTO: DietPlanDTO) => {
            this.dietPlanDTO = dietPlanDTO;
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

  goBack() {
    const order = [
      PlanStatus.BODY_METRICS,
      PlanStatus.PLAN_SELECTION,
      PlanStatus.MEAL_PREFERENCE,
      PlanStatus.PREVIEW,
    ];
    const idx = order.indexOf(this.currentPlanStatus);
    if (idx > 0) {
      this.currentPlanStatus = order[idx - 1];
    }
  }

  onBodyMetricsReceived($event: BodyMetricsResponse) {
    this.bodyMetricsResponse = $event;
    this.currentPlanStatus = PlanStatus.PLAN_SELECTION;
  }

  onGoalSelected($event: CalorieEstimationResponse) {
    this.calorieEstimationResponse = $event;
    this.currentPlanStatus = PlanStatus.MEAL_PREFERENCE;
  }

  onMealPreference($event: DietPlanDTO) {
    this.dietPlanDTO = $event;
    this.currentPlanStatus = PlanStatus.PREVIEW;
  }

  createDietPlan($event: DietPlanDTO) {
    this.router.navigate(['/diet-plan', $event.id]);
  }
}

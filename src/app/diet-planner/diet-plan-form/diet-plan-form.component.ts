import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DietPlanService } from '../diet-plan-service';
import { DietPlanDTO } from '../dto/diet-plan.dto';
import { ToastComponent } from '../../toast/toast.component';
import { PlanStatus } from '../enum/plan-status';
import { BodyMetricsFormComponent } from './body-metrics-form/body-metrics-form.component';
import { DietPlanPreviewFormComponent } from './diet-plan-preview-form/diet-plan-preview-form.component';
import { DietPlanSelectionFormComponent } from './diet-plan-selection-form/diet-plan-selection-form.component';
import { MealPreferenceFormComponent } from './meal-preference-form/meal-preference-form.component';

@Component({
  selector: 'app-diet-plan-form',
  templateUrl: './diet-plan-form.component.html',
  styleUrl: './diet-plan-form.component.css',
  imports: [
    ToastComponent,
    BodyMetricsFormComponent,
    DietPlanPreviewFormComponent,
    DietPlanSelectionFormComponent,
    MealPreferenceFormComponent,
  ],
})
export class DietPlanFormComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  tdee: number = 0;

  dietPlanDTO!: DietPlanDTO;
  dietPlanId: string | null = null;

  planStatus = PlanStatus;
  currentPlanStatus: PlanStatus = PlanStatus.BODY_METRICS;

  constructor(
    private router: Router,
    private dietPlanService: DietPlanService,
  ) {
    this.dietPlanDTO = new DietPlanDTO();
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

  onTdeeReceived($event: number) {
    this.tdee = $event;
    this.currentPlanStatus = PlanStatus.PLAN_SELECTION;
  }
}

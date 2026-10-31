import { Component, OnInit, output, ViewChild, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DietPlanService } from '../../diet-plan-service';
import { BodyMetricsRequest, BodyMetricsResponse, DietPlanDTO } from '../../dto/diet-plan.dto';
import { Plan } from '../../enum/plan.enum';
import { Gender } from '../../enum/gender.enum';
import { Activity } from '../../enum/activity.enum';
import { DropdownModel } from '../../../shared/model/dropdown.model';
import { ToastComponent } from '../../../toast/toast.component';

@Component({
  selector: 'app-body-metrics-form',
  templateUrl: './body-metrics-form.component.html',
  styleUrl: './body-metrics-form.component.css',
  imports: [FormsModule, ToastComponent],
})
export class BodyMetricsFormComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  bmr = output<BodyMetricsResponse>();

  plans = [
    new DropdownModel('Weight Loss', Plan.WEIGHT_LOSS),
    new DropdownModel('Weight Gain', Plan.WEIGHT_GAIN),
  ];
  genders = [
    new DropdownModel('Male', Gender.MALE),
    new DropdownModel('Female', Gender.FEMALE),
  ];
  activities = [
    new DropdownModel('Sedentary', Activity.SEDENTARY),
    new DropdownModel('Light', Activity.LIGHT),
    new DropdownModel('Moderate', Activity.MODERATE),
    new DropdownModel('Hard', Activity.HARD),
    new DropdownModel('Athlete', Activity.ATHLETE),
  ];

  dietPlanId: string | null = null;
  bodyMetrics: BodyMetricsRequest = {
    title: '',
    plan: Plan.WEIGHT_LOSS,
    age: 0,
    gender: Gender.MALE,
    height: 0,
    weight: 0,
    targetWeight: 0,
    activity: Activity.SEDENTARY,
  };

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
          next: (request: BodyMetricsRequest) => {
            this.bodyMetrics = request;
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

  calculateCalories() {
    if (this.validateFields()) {
      this.dietPlanService.calculateTDEE(this.bodyMetrics).subscribe({
        next: (res: BodyMetricsResponse) => {
          this.bmr.emit(res);
        },
        error: ({ status, error }) => {
          if (status === 400) {
            this.toast.showError(error.error[0]);
          }
        },
      });
    }
  }

  // updateDietPlan() {
  //   this.mapSelected();
  //   if (this.validateFields()) {
  //     this.dietPlanService.updateDietPlan(this.bodyMetrics).subscribe({
  //       next: () => {
  //         this.router.navigate(['/']);
  //       },
  //       error: ({ status, error }) => {
  //         if (status === 400) {
  //           this.toast.showError(error.error[0]);
  //         }
  //       },
  //     });
  //   }
  // }

  private validateFields() {
    if (!this.bodyMetrics.title) {
      this.toast.showError('Title is empty');
      return false;
    }
    const age = this.bodyMetrics.age;
    if (!age || age < 18 || age > 65) {
      this.toast.showError('Age requirement: 18-65');
      return false;
    }
    const height = this.bodyMetrics.height;
    if (!height || height < 140 || height > 210) {
      this.toast.showError('Height requirement: 140-210cm');
      return false;
    }
    const weight = this.bodyMetrics.weight;
    if (!weight || weight < 40 || weight > 180) {
      this.toast.showError('Weight requirement: 40-180kg');
      return false;
    }
    if (!this.validateTargetWeight(this.bodyMetrics.targetWeight)) {
      return false;
    }
    return true;
  }

  private validateTargetWeight(targetWeight: number) {
    if (!targetWeight) {
      this.toast.showError('Target Weight is empty');
      return false;
    } else if (this.bodyMetrics.plan === Plan.WEIGHT_LOSS) {
      if (targetWeight >= this.bodyMetrics.weight) {
        this.toast.showError('Target weight must be less than current weight');
        return false;
      } else if (targetWeight < 40) {
        this.toast.showError(
          'Target weight must be greater than or equal to 40kg',
        );
        return false;
      }
    } else if (this.bodyMetrics.plan === Plan.WEIGHT_GAIN) {
      if (targetWeight <= this.bodyMetrics.weight) {
        this.toast.showError(
          'Target weight must be greater than current weight',
        );
        return false;
      } else if (targetWeight > 110) {
        this.toast.showError(
          'Target weight must be less than or equal to 110kg',
        );
        return false;
      }
    }
    return true;
  }

  selectDietPlan(plan: Plan) {
    this.bodyMetrics.plan = plan;
  }

  selectGender(gender: Gender) {
    this.bodyMetrics.gender = gender;
  }

  selectActivity(activity: Activity) {
    this.bodyMetrics.activity = activity;
  }
}

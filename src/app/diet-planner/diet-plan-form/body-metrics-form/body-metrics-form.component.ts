import { Component, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../toast/toast.component';
import { DietPlanService } from '../../diet-plan-service';
import { Plan } from '../../enum/plan.enum';
import { Gender } from '../../enum/gender.enum';
import { Activity } from '../../enum/activity.enum';
import { Option } from '../../../shared/model/option.model';
import type {
  BodyMetricsRequest,
  BodyMetricsResponse,
} from '../../dto/diet-plan.dto';

@Component({
  selector: 'app-body-metrics-form',
  templateUrl: './body-metrics-form.component.html',
  styleUrl: './body-metrics-form.component.css',
  imports: [FormsModule, ToastComponent],
})
export class BodyMetricsFormComponent {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  bmr = output<BodyMetricsResponse>();

  plans = [
    new Option('Weight Loss', Plan.WEIGHT_LOSS),
    new Option('Weight Gain', Plan.WEIGHT_GAIN),
  ];
  genders = [
    new Option('Male', Gender.MALE),
    new Option('Female', Gender.FEMALE),
  ];
  activities = [
    new Option('Sedentary', Activity.SEDENTARY),
    new Option('Light', Activity.LIGHT),
    new Option('Moderate', Activity.MODERATE),
    new Option('Hard', Activity.HARD),
    new Option('Athlete', Activity.ATHLETE),
  ];

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

  constructor(private dietPlanService: DietPlanService) {}

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

  private validateFields() {
    if (!this.bodyMetrics.title) {
      this.toast.showError('Title is required');
      return false;
    }
    const age = this.bodyMetrics.age;
    if (!age || age < 18 || age > 65) {
      this.toast.showError('Age must be between 18 and 65');
      return false;
    }
    const height = this.bodyMetrics.height;
    if (!height || height < 140 || height > 210) {
      this.toast.showError('Height must be between 140 and 210 cm');
      return false;
    }
    const weight = this.bodyMetrics.weight;
    if (!weight || weight < 40 || weight > 180) {
      this.toast.showError('Weight must be between 40 and 180 kg');
      return false;
    }
    if (!this.validateTargetWeight(this.bodyMetrics.targetWeight)) {
      return false;
    }
    return true;
  }

  private validateTargetWeight(targetWeight: number) {
    if (!targetWeight) {
      this.toast.showError('Target weight is required');
      return false;
    } else if (this.bodyMetrics.plan === Plan.WEIGHT_LOSS) {
      if (targetWeight >= this.bodyMetrics.weight) {
        this.toast.showError('Target weight must be less than current weight');
        return false;
      } else if (targetWeight < 40) {
        this.toast.showError('Target weight must be at least 40 kg');
        return false;
      }
    } else if (this.bodyMetrics.plan === Plan.WEIGHT_GAIN) {
      if (targetWeight <= this.bodyMetrics.weight) {
        this.toast.showError(
          'Target weight must be greater than current weight',
        );
        return false;
      } else if (targetWeight > 110) {
        this.toast.showError('Target weight must not exceed 110 kg');
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

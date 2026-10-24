import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DietPlanService } from '../../diet-plan-service';
import { DietPlanDTO } from '../../dto/diet-plan.dto';
import { Plan } from '../../enum/plan.enum';
import { Gender } from '../../enum/gender.enum';
import { Goal } from '../../enum/goal.enum';
import { Activity } from '../../enum/activity.enum';
import { DropdownModel } from '../../../shared/model/dropdown.model';
import { ToastComponent } from '../../../toast/toast.component';

@Component({
  selector: 'app-diet-plan-selection-form',
  templateUrl: './diet-plan-selection-form.component.html',
  styleUrl: './diet-plan-selection-form.component.css',
  imports: [FormsModule, ToastComponent],
})
export class DietPlanSelectionFormComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  dietPlanDTO!: DietPlanDTO;
  dietPlanId: string | null = null;

  plans = [
    new DropdownModel('Weight Loss', Plan.WEIGHT_LOSS),
    new DropdownModel('Weight Gain', Plan.WEIGHT_GAIN),
  ];
  genders = [
    new DropdownModel('Male', Gender.MALE),
    new DropdownModel('Female', Gender.FEMALE),
  ];
  goals = [
    new DropdownModel('Mild', Goal.MILD),
    new DropdownModel('Moderate', Goal.MODERATE),
    new DropdownModel('Aggressive', Goal.AGGRESSIVE),
  ];
  activities = [
    new DropdownModel('Sedentary', Activity.SEDENTARY),
    new DropdownModel('Light', Activity.LIGHT),
    new DropdownModel('Moderate', Activity.MODERATE),
    new DropdownModel('Hard', Activity.HARD),
    new DropdownModel('Athlete', Activity.ATHLETE),
  ];
  selected = {
    plan: Plan.WEIGHT_LOSS,
    gender: Gender.MALE,
    goal: Goal.MILD,
    activity: Activity.SEDENTARY,
  };

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
            this.selected.plan = this.dietPlanDTO.plan;
            this.selected.gender = this.dietPlanDTO.gender;
            this.selected.goal = this.dietPlanDTO.goal;
            this.selected.activity = this.dietPlanDTO.activity;
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

  createDietPlan() {
    this.mapSelected();
    if (this.validateFields()) {
      this.dietPlanService.createDietPlan(this.dietPlanDTO).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: ({ status, error }) => {
          if (status === 400) {
            this.toast.showError(error.error[0]);
          }
        },
      });
    }
  }

  updateDietPlan() {
    this.mapSelected();
    if (this.validateFields()) {
      this.dietPlanService.updateDietPlan(this.dietPlanDTO).subscribe({
        next: () => {
          this.router.navigate(['/']);
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
    if (!this.dietPlanDTO.title) {
      this.toast.showError('Title is empty');
      return false;
    }
    const age = this.dietPlanDTO.age;
    if (!age || age < 18 || age > 65) {
      this.toast.showError('Age requirement: 18-65');
      return false;
    }
    const height = this.dietPlanDTO.height;
    if (!height || height < 140 || height > 210) {
      this.toast.showError('Height requirement: 140-210cm');
      return false;
    }
    const weight = this.dietPlanDTO.weight;
    if (!weight || weight < 40 || weight > 180) {
      this.toast.showError('Weight requirement: 40-180kg');
      return false;
    }
    if (!this.validateTargetWeight(this.dietPlanDTO.targetWeight)) {
      return false;
    }
    const duration = this.dietPlanDTO.duration;
    if (!duration || duration < 14 || duration > 730) {
      this.toast.showError('Duration requirement: 14-730 days');
      return false;
    }
    return true;
  }

  private validateTargetWeight(targetWeight: number) {
    if (!targetWeight) {
      this.toast.showError('Target Weight is empty');
      return false;
    } else if (this.dietPlanDTO.plan === Plan.WEIGHT_LOSS) {
      if (targetWeight >= this.dietPlanDTO.weight) {
        this.toast.showError('Target weight must be less than current weight');
        return false;
      } else if (targetWeight < 40) {
        this.toast.showError(
          'Target weight must be greater than or equal to 40kg',
        );
        return false;
      }
    } else if (this.dietPlanDTO.plan === Plan.WEIGHT_GAIN) {
      if (targetWeight <= this.dietPlanDTO.weight) {
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

  private mapSelected() {
    this.dietPlanDTO.plan = this.selected.plan;
    this.dietPlanDTO.gender = this.selected.gender;
    this.dietPlanDTO.goal = this.selected.goal;
    this.dietPlanDTO.activity = this.selected.activity;
  }

  selectDietPlan(plan: Plan) {
    this.selected.plan = plan;
  }

  selectGender(gender: Gender) {
    this.selected.gender = gender;
  }

  selectGoal(goal: Goal) {
    this.selected.goal = goal;
  }

  selectActivity(activity: Activity) {
    this.selected.activity = activity;
  }

  getTargetWeightPlaceholder() {
    let plan =
      this.selected.plan === Plan.WEIGHT_LOSS ? 'weight loss' : 'weight gain';
    return `Target ${plan} in kilograms`;
  }
}

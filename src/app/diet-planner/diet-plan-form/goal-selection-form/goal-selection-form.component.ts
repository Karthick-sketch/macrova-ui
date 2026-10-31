import { Component, input, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DietPlanService } from '../../diet-plan-service';
import { DietPlanDTO, GoalSectionRequest } from '../../dto/diet-plan.dto';
import { Goal } from '../../enum/goal.enum';
import { ToastComponent } from '../../../toast/toast.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-goal-selection-form',
  templateUrl: './goal-selection-form.component.html',
  styleUrl: './goal-selection-form.component.css',
  imports: [FormsModule, ToastComponent, DecimalPipe],
})
export class GoalSelectionFormComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  tdee = input.required<number>();

  goalSectionEvent = output<GoalSectionRequest>();

  Goal = Goal;
  durations = [90, 180, 360];
  selectedGoal: GoalSectionRequest = {
    goal: Goal.MILD,
    duration: 90,
  };

  dietPlanId: string | null = null;

  constructor(
    private router: Router,
    private dietPlanService: DietPlanService,
  ) {
    // this.dietPlanDTO = new DietPlanDTO();
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation?.extras.state) {
    //   this.dietPlanId = navigation.extras.state['pastPlanId'];
    // }
  }

  ngOnInit() {
    this.dietPlanService.isThereAnyActivePlans().subscribe((value) => {
      if (value) {
        this.router.navigate(['/']);
      } else if (this.dietPlanId) {
        this.dietPlanService.getDietPlanById(this.dietPlanId).subscribe({
          next: (dietPlanDTO: DietPlanDTO) => { },
          error: ({ status, error }) => {
            if (status === 404) {
              this.toast.showError(error.error[0]);
            }
          },
        });
      }
    });
  }

  submit() {
    this.goalSectionEvent.emit(this.selectedGoal);
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

  selectGoal(goal: Goal) {
    this.selectedGoal.goal = goal;
  }

  selectDuration(duration: number) {
    this.selectedGoal.duration = duration;
  }
}

import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { DietPlanService } from '../../diet-plan-service';
import { Goal } from '../../enum/goal.enum';
import type {
  BodyMetricsResponse,
  GoalSectionRequest,
} from '../../dto/diet-plan.dto';
import type { CalorieEstimationResponse } from '../../dto/calories.dto';

@Component({
  selector: 'app-goal-selection-form',
  templateUrl: './goal-selection-form.component.html',
  styleUrl: './goal-selection-form.component.css',
  imports: [FormsModule, DecimalPipe],
})
export class GoalSelectionFormComponent {
  bodyMetrics = input.required<BodyMetricsResponse>();

  goalSectionEvent = output<CalorieEstimationResponse>();

  Goal = Goal;
  durations = [90, 180, 360];
  selectedGoal: GoalSectionRequest = {
    goal: Goal.MODERATE,
    duration: 180,
  };

  constructor(private dietPlanService: DietPlanService) {}

  submit() {
    this.dietPlanService
      .createDietPlanGoalSelection(this.selectedGoal)
      .subscribe((response: CalorieEstimationResponse) =>
        this.goalSectionEvent.emit(response),
      );
  }

  selectGoal(goal: Goal) {
    this.selectedGoal.goal = goal;
  }

  selectDuration(duration: number) {
    this.selectedGoal.duration = duration;
  }
}

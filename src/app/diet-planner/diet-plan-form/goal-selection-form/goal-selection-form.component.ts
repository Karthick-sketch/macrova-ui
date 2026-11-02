import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Goal } from '../../enum/goal.enum';
import type { GoalSectionRequest } from '../../dto/diet-plan.dto';

@Component({
  selector: 'app-goal-selection-form',
  templateUrl: './goal-selection-form.component.html',
  styleUrl: './goal-selection-form.component.css',
  imports: [FormsModule, DecimalPipe],
})
export class GoalSelectionFormComponent {
  tdee = input.required<number>();
  currentWeight = input.required<number>();
  targetWeight = input.required<number>();

  goalSectionEvent = output<GoalSectionRequest>();

  Goal = Goal;
  durations = [90, 180, 360];
  selectedGoal: GoalSectionRequest = {
    goal: Goal.MODERATE,
    duration: 180,
  };

  submit() {
    this.goalSectionEvent.emit(this.selectedGoal);
  }

  selectGoal(goal: Goal) {
    this.selectedGoal.goal = goal;
  }

  selectDuration(duration: number) {
    this.selectedGoal.duration = duration;
  }
}

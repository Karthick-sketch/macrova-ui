import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DietPlanDTO } from '../../dto/diet-plan.dto';

@Component({
  selector: 'app-diet-plan-preview-form',
  templateUrl: './diet-plan-preview-form.component.html',
  styleUrl: './diet-plan-preview-form.component.css',
  imports: [DecimalPipe],
})
export class DietPlanPreviewFormComponent {
  dietPlan = input.required<DietPlanDTO>();

  createDietEvent = output<void>();

  createDiet() {
    this.createDietEvent.emit();
  }
}

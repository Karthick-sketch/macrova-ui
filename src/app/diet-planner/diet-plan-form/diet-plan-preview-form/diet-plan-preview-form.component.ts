import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DietPlanService } from '../../diet-plan-service';
import type { DietPlanDTO } from '../../dto/diet-plan.dto';

@Component({
  selector: 'app-diet-plan-preview-form',
  templateUrl: './diet-plan-preview-form.component.html',
  styleUrl: './diet-plan-preview-form.component.css',
  imports: [DecimalPipe],
})
export class DietPlanPreviewFormComponent {
  dietPlan = input.required<DietPlanDTO>();

  createDietEvent = output<DietPlanDTO>();

  constructor(private dietPlanService: DietPlanService) {}

  createDiet() {
    this.dietPlanService
      .createDietPlan()
      .subscribe((dietPlanDTO: DietPlanDTO) =>
        this.createDietEvent.emit(dietPlanDTO),
      );
  }
}

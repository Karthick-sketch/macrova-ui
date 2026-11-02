import { Component, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { DietPlanService } from '../../diet-plan-service';
import { DietPlanDTO } from '../../dto/diet-plan.dto';

@Component({
  selector: 'app-diet-plan-preview-form',
  templateUrl: './diet-plan-preview-form.component.html',
  styleUrl: './diet-plan-preview-form.component.css',
  imports: [FormsModule, DecimalPipe],
})
export class DietPlanPreviewFormComponent implements OnInit {
  dietPlan = input.required<DietPlanDTO>();

  createDietEvent = output<void>();

  constructor(
    private router: Router,
    private dietPlanService: DietPlanService,
  ) {}

  ngOnInit() {
    this.dietPlanService.isThereAnyActivePlans().subscribe((value) => {
      if (value) {
        this.router.navigate(['/']);
      }
    });
  }

  createDiet() {
    this.createDietEvent.emit();
  }
}

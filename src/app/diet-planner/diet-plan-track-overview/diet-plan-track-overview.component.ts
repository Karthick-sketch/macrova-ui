import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DietPlanService } from '../diet-plan-service';
import type { DietPlanTrackDTO } from '../dto/diet-plan-track.dto';
import type { MealKcalDTO } from '../dto/meal-kcal.dto';

@Component({
  selector: 'app-diet-plan-track-overview',
  templateUrl: './diet-plan-track-overview.component.html',
  styleUrl: './diet-plan-track-overview.component.css',
  imports: [NgTemplateOutlet, FormsModule, DatePipe],
})
export class DietPlanTrackOverviewComponent implements OnInit {
  dietPlanTrack!: DietPlanTrackDTO;
  meals!: MealKcalDTO;
  kcalPercentage!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dietPlanService: DietPlanService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dietPlanService.getDietPlanTrackById(id).subscribe({
        next: (dietPlanTrackDTO: DietPlanTrackDTO) => {
          this.dietPlanTrack = dietPlanTrackDTO;
          this.meals = dietPlanTrackDTO.mealKcal;
          this.setKcalPercentage();
        },
        error: (err) => {
          if (err.status === 404) {
            this.router.navigate(['/not-found']);
          }
        },
      });
    }
  }

  setKcalPercentage() {
    this.kcalPercentage =
      (this.dietPlanTrack.intake.taken / this.dietPlanTrack.intake.total) * 100;
  }
}

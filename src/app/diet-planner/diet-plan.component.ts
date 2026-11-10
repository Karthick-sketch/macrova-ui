import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DietPlanService } from './diet-plan-service';
import type { DietPlanTrackDTO } from './dto/diet-plan-track.dto';
import type { MealKcalDTO } from './dto/meal-kcal.dto';
import type { MacrosDTO } from './dto/macros.dto';
import type { DietPlanDTO } from './dto/diet-plan.dto';

@Component({
  selector: 'app-diet-plan',
  templateUrl: './diet-plan.component.html',
  styleUrl: './diet-plan.component.css',
  imports: [NgTemplateOutlet, FormsModule],
})
export class DietPlanComponent implements OnInit {
  dietPlan!: DietPlanDTO;
  dietPlanTrack!: DietPlanTrackDTO;
  meals!: MealKcalDTO;
  kcalPercentage!: number;

  constructor(
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private dietPlanService: DietPlanService,
  ) {}

  ngOnInit(): void {
    this.dietPlanService.isDietPlanReachedDuration().subscribe((status) => {
      if (status) {
        this.router.navigate(['/no-active-plan']);
      } else {
        this.dietPlanService.getDietPlan().subscribe({
          next: (dietPlanDTO: DietPlanDTO) => {
            this.dietPlan = dietPlanDTO;
            this.dietPlanService.getDietPlanTrack(dietPlanDTO.id).subscribe({
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
          },
          error: (err) => {
            if (err.status === 404) {
              this.router.navigate(['/no-active-plan']);
            }
          },
        });
      }
    });
  }

  closeAddKcalWindow() {
    this.viewContainerRef.clear();
  }

  updateKcal(category: string, macros: MacrosDTO) {
    this.dietPlanService
      .updateMacros(this.dietPlan.id, category.toLowerCase(), macros)
      .subscribe((dietPlanTrackDTO: DietPlanTrackDTO) => {
        this.dietPlanTrack = dietPlanTrackDTO;
        this.meals = dietPlanTrackDTO.mealKcal;
        this.setKcalPercentage();
      });
    this.closeAddKcalWindow();
  }

  addWeight() {
    this.dietPlanService
      .addWeight(this.dietPlan.id, this.dietPlanTrack.weight)
      .subscribe((dietPlanTrackDTO: DietPlanTrackDTO) => {
        this.dietPlanTrack = dietPlanTrackDTO;
        this.meals = dietPlanTrackDTO.mealKcal;
        this.setKcalPercentage();
      });
  }

  setKcalPercentage() {
    this.kcalPercentage =
      (this.dietPlanTrack.intake.taken / this.dietPlanTrack.intake.total) * 100;
  }
}

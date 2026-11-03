import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LimitReachPipe } from './pipe/limitreach.pipe';
import { DietPlanService } from '../diet-planner/diet-plan-service';
import { WeightTrackComponent } from './weight-track/weight-track.component';
import type { MetricsDTO } from '../diet-planner/dto/metrics.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [WeightTrackComponent, LimitReachPipe],
})
export class DashboardComponent implements OnInit {
  metrics!: MetricsDTO;

  constructor(
    private dietPlanService: DietPlanService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.dietPlanService.isDietPlanReachedDuration().subscribe((status) => {
      if (status) {
        this.router.navigate(['/no-active-plan']);
      } else {
        this.dietPlanService.getMetrics().subscribe({
          next: (metricsDTO: MetricsDTO) => {
            this.metrics = metricsDTO;
          },
          error: (err: any) => {
            if (err.status === 404) {
              this.router.navigate(['/no-active-plan']);
            }
          },
        });
      }
    });
  }
}

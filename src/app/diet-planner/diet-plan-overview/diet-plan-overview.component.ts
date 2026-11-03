import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DietPlanService } from '../diet-plan-service';
import type { DietPlanOverviewDTO } from '../dto/diet-plan-overview.dto';

@Component({
  selector: 'app-diet-plan-overview',
  templateUrl: 'diet-plan-overview.component.html',
  styleUrl: 'diet-plan-overview.component.css',
  imports: [DatePipe, RouterLink],
})
export class DietPlanOverviewComponent implements OnInit {
  plans!: DietPlanOverviewDTO[];

  constructor(
    private route: ActivatedRoute,
    private dietPlanService: DietPlanService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dietPlanService.getDietPlanOverview(id).subscribe((plans) => {
        this.plans = plans;
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DietPlanService } from '../diet-plan-service';
import { Plan } from '../enum/plan.enum';
import { DietPlanHistoryDTO } from '../dto/diet-plan-history.dto';
import { PlanStatus } from '../enum/plan-status.enum';

@Component({
  selector: 'app-diet-plans-list',
  templateUrl: './diet-plans-list.component.html',
  styleUrl: './diet-plans-list.component.css',
  imports: [NgTemplateOutlet, RouterLink],
})
export class DietPlansListComponent implements OnInit {
  dietPlans!: DietPlanHistoryDTO[];
  Plan = Plan;

  constructor(private dietPlanService: DietPlanService) {}

  ngOnInit(): void {
    this.dietPlanService
      .getDietPlansHistory()
      .subscribe((dietPlanModels: DietPlanHistoryDTO[]) => {
        this.dietPlans = dietPlanModels;
      });
  }

  getPlan(plan: Plan) {
    return plan === Plan.WEIGHT_LOSS ? 'Weight Loss' : 'Weight Gain';
  }

  getStatus(status: boolean) {
    return status ? 'Active' : 'Inactive';
  }

  isActive(planStatus: PlanStatus) {
    return planStatus === PlanStatus.ACTIVE;
  }
}

import type { Plan } from '../enum/plan.enum';
import type { PlanStatus } from '../enum/plan-status.enum';

export interface DietPlanHistoryDTO {
  id: string;
  title: string;
  plan: Plan;
  weight: number;
  targetWeight: number;
  duration: number;
  planStatus: PlanStatus;
}

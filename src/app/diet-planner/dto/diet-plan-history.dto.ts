import type { Plan } from '../enum/plan.enum';

export interface DietPlanHistoryDTO {
  id: string;
  title: string;
  plan: Plan;
  weight: number;
  targetWeight: number;
  duration: number;
  active: boolean;
}

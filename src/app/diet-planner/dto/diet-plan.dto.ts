import { Gender } from '../enum/gender.enum';
import { Goal } from '../enum/goal.enum';
import { Activity } from '../enum/activity.enum';
import { Plan } from '../enum/plan.enum';

export class DietPlanDTO {
  id!: string;
  title!: string;
  plan!: Plan;
  age!: number;
  gender!: Gender;
  height!: number;
  weight!: number;
  goal!: Goal;
  targetWeight!: number;
  duration!: number;
  activity!: Activity;
}

export interface BodyMetricsDTO {
  title: string;
  plan: Plan;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  activity: Activity;
}

export interface TdeeDTO {
  tdee: number;
}

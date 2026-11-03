import type { Activity } from '../enum/activity.enum';
import type { DietTypes } from '../enum/diet-types.enum';
import type { Gender } from '../enum/gender.enum';
import type { Goal } from '../enum/goal.enum';
import type { MealTypes } from '../enum/meal-types.enum';
import type { FormStatus } from '../enum/form-status.enum';
import type { Plan } from '../enum/plan.enum';
import type { PlanStatus } from '../enum/plan-status.enum';
import type { Macros } from './macros.dto';
import type { CalorieEstimationResponse } from './calories.dto';

export interface DietPlanDTO {
  id: string;
  title: string;
  plan: Plan;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  targetWeight: number;
  activity: Activity;
  goal: Goal;
  duration: number;
  tdee: number;
  targetCalories: number;
  dietType: string;
  mealType: string;
  macros: Macros;
  mealCount: number;
  eveningSnack: boolean;
}

export interface DietPlanFormStatus {
  planStatus: PlanStatus;
  formStatus: FormStatus;
  dietPlan?: DietPlanDTO;
  bodyMetrics?: BodyMetricsResponse;
  caloriesEstimation?: CalorieEstimationResponse;
}

export interface BodyMetricsRequest {
  title: string;
  plan: Plan;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  activity: Activity;
}

export interface BodyMetricsResponse {
  tdee: number;
  weight: number;
  targetWeight: number;
  plan: Plan;
}

export interface GoalSectionRequest {
  goal: Goal;
  duration: number;
}

export interface MealPreferenceRequest {
  macros: Macros;
  dietType: DietTypes;
  mealType: MealTypes;
  mealCount: number;
  eveningSnack: boolean;
}

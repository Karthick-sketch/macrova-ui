import type { Activity } from '../enum/activity.enum';
import type { DietType } from '../enum/diet-type.enum';
import type { Gender } from '../enum/gender.enum';
import type { Goal } from '../enum/goal.enum';
import type { MealType } from '../enum/meal-type.enum';
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
  currentCalories: number;
  dietType: DietType;
  mealType: MealType;
  macros: Macros;
  mealCount: number;
  eveningSnack: boolean;
}

export interface DietPlanFormStatus {
  planStatus: PlanStatus;
  formStatus: FormStatus;
  dietPlan?: DietPlanDTO;
  bodyMetricsRequest?: BodyMetricsRequest;
  bodyMetricsResponse?: BodyMetricsResponse;
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
  currentCalories: number;
  macros: Macros;
  dietType: DietType;
  mealType: MealType;
  mealCount: number;
  eveningSnack: boolean;
}

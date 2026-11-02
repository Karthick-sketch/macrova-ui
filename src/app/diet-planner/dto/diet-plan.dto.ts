import { Gender } from '../enum/gender.enum';
import { Goal } from '../enum/goal.enum';
import { Activity } from '../enum/activity.enum';
import { Plan } from '../enum/plan.enum';
import type { MacroPreference } from './macros.dto';

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
  macroPreference: MacroPreference;
  mealCount: number;
  eveningSnack: boolean;
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
  macroPreference: MacroPreference;
  dietType: string;
  mealType: string;
  numberOfMeals: number;
  eveningSnack: boolean;
}

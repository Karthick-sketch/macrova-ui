import { Gender } from '../enum/gender.enum';
import { Goal } from '../enum/goal.enum';
import { Activity } from '../enum/activity.enum';
import { Plan } from '../enum/plan.enum';
import { MacrosRequest } from './macros.dto';

export interface DietPlanDTO {
  id: string;
  title: string;
  plan: Plan;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  goal: Goal;
  targetWeight: number;
  duration: number;
  activity: Activity;
  macronutrientPreference: MacrosRequest;
  mealPreference: string;
  numberOfMeals: number;
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
  title: string;
  plan: Plan;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  activity: Activity;
  tdee: number;
}

export interface GoalSectionRequest {
  goal: Goal;
  duration: number;
}

export interface MealPreferenceRequest {
  macronutrientPreference: MacrosRequest;
  mealPreference: string;
  numberOfMeals: number;
  eveningSnack: boolean;
}

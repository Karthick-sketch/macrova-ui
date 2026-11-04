import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { DietPlanTrackDTO } from './dto/diet-plan-track.dto';
import type { MetricsDTO } from './dto/metrics.dto';
import type { DietPlanOverviewDTO } from './dto/diet-plan-overview.dto';
import type {
  BodyMetricsRequest,
  BodyMetricsResponse,
  DietPlanDTO,
  DietPlanFormStatus,
  GoalSectionRequest,
  MealPreferenceRequest,
} from './dto/diet-plan.dto';
import type { MacrosDTO } from './dto/macros.dto';
import type { DietPlanHistoryDTO } from './dto/diet-plan-history.dto';
import type { CalorieEstimationResponse } from './dto/calories.dto';
import { FormStatus } from './enum/form-status.enum';

@Injectable({
  providedIn: 'root',
})
export class DietPlanService {
  basePath = '/diet-plan';

  constructor(private http: HttpClient) {}

  isDietPlanReachedDuration() {
    return this.http.get<boolean>(`${this.basePath}/status`);
  }

  getDietPlansHistory() {
    return this.http.get<DietPlanHistoryDTO[]>(`${this.basePath}/history`);
  }

  getPastDietPlan() {
    return this.http.get<DietPlanHistoryDTO>(`${this.basePath}/past-plan`);
  }

  getDietPlan() {
    return this.http.get<DietPlanDTO>(this.basePath);
  }

  getDietPlanById(dietPlanId: string) {
    return this.http.get<DietPlanDTO>(`${this.basePath}/${dietPlanId}`);
  }

  getDietPlanFormStatus() {
    return this.http.get<DietPlanFormStatus>(`${this.basePath}/form/status`);
  }

  fetchDietPlanFormDetails(status: FormStatus) {
    return this.http.post<DietPlanFormStatus>(`${this.basePath}/form/status`, {
      formStatus: status,
    });
  }

  createDietPlanBodyMetrics(bodyMetricsDTO: BodyMetricsRequest) {
    return this.http.post<BodyMetricsResponse>(
      `${this.basePath}/form/body-metrics`,
      bodyMetricsDTO,
    );
  }

  createDietPlanGoalSelection(request: GoalSectionRequest) {
    return this.http.post<CalorieEstimationResponse>(
      `${this.basePath}/form/goal-selection`,
      request,
    );
  }

  createDietPlanMealPreference(request: MealPreferenceRequest) {
    return this.http.post<DietPlanDTO>(
      `${this.basePath}/form/meal-preference`,
      request,
    );
  }

  createDietPlan() {
    return this.http.post<DietPlanDTO>(`${this.basePath}/form/create`, {});
  }

  updateDietPlan(dietPlanDTO: DietPlanDTO) {
    return this.http.put<DietPlanDTO>(`${this.basePath}/update`, dietPlanDTO);
  }

  addWeight(dietPlanId: string, weight: number) {
    return this.http.post<DietPlanTrackDTO>(
      `${this.basePath}/add-weight/${dietPlanId}`,
      weight,
    );
  }

  getDietPlanTrackById(dietPlanTrackId: string) {
    return this.http.get<DietPlanTrackDTO>(
      `${this.basePath}/track/${dietPlanTrackId}`,
    );
  }

  getDietPlanTrack(dietPlanId: string) {
    return this.http.get<DietPlanTrackDTO>(
      `${this.basePath}/track/plan/${dietPlanId}`,
    );
  }

  updateMacros(dietPlanId: string, category: string, macros: MacrosDTO) {
    return this.http.post<DietPlanTrackDTO>(
      `${this.basePath}/${category}/${dietPlanId}`,
      macros,
    );
  }

  getMetrics() {
    return this.http.get<MetricsDTO>(`${this.basePath}/metrics`);
  }

  getDietPlanOverview(id: string) {
    return this.http.get<DietPlanOverviewDTO[]>(
      `${this.basePath}/overview/${id}`,
    );
  }
}

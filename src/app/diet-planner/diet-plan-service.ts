import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DietPlanModel } from './model/diet-plan.model';
import { DietPlanTrackModel } from './model/diet-plan-track.model';
import { MetricsModel } from './model/metrics.model';
import { DietPlanOverviewModel } from './model/diet-plan-overview.model';
import { BodyMetricsDTO, DietPlanDTO } from './dto/diet-plan.dto';
import { MacrosDTO } from './dto/macros.dto';
import { DietPlanHistoryDTO } from './dto/diet-plan-history.dto';

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
    return this.http.get<DietPlanModel>(this.basePath);
  }

  getDietPlanById(dietPlanId: string) {
    return this.http.get<DietPlanDTO>(`${this.basePath}/${dietPlanId}`);
  }

  calculateCalories(bodyMetricsDTO: BodyMetricsDTO) {
    return this.http.post<number>(
      `${this.basePath}/body-metrics`,
      bodyMetricsDTO,
    );
  }

  createDietPlan(dietPlanDTO: DietPlanDTO) {
    return this.http.post<DietPlanModel>(this.basePath, dietPlanDTO);
  }

  updateDietPlan(dietPlanDTO: DietPlanDTO) {
    return this.http.put<DietPlanModel>(`${this.basePath}/update`, dietPlanDTO);
  }

  addWeight(dietPlanId: string, weight: number) {
    return this.http.post<DietPlanTrackModel>(
      `${this.basePath}/add-weight/${dietPlanId}`,
      weight,
    );
  }

  getDietPlanTrackById(dietPlanTrackId: string) {
    return this.http.get<DietPlanTrackModel>(
      `${this.basePath}/track/${dietPlanTrackId}`,
    );
  }

  getDietPlanTrack(dietPlanId: string) {
    return this.http.get<DietPlanTrackModel>(
      `${this.basePath}/track/plan/${dietPlanId}`,
    );
  }

  updateMacros(dietPlanId: string, category: string, macros: MacrosDTO) {
    return this.http.post<DietPlanTrackModel>(
      `${this.basePath}/${category}/${dietPlanId}`,
      macros,
    );
  }

  getMetrics() {
    return this.http.get<MetricsModel>(`${this.basePath}/metrics`);
  }

  isThereAnyActivePlans() {
    return this.http.get<boolean>(`${this.basePath}/active-plans`);
  }

  getDietPlanOverview(id: string) {
    return this.http.get<DietPlanOverviewModel[]>(
      `${this.basePath}/overview/${id}`,
    );
  }
}

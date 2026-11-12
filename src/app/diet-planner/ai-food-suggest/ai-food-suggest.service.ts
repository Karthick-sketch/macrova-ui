import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import type { FilterDto } from './dto/filter.dto';
import type {
  AIFoodSuggestData,
  AIFoodSuggestErrorResponse,
} from './dto/ai-food-suggest.dto';

@Injectable({
  providedIn: 'root',
})
export class AIFoodSuggestService {
  constructor(private httpClient: HttpClient) {}

  suggestFoods(filter: FilterDto) {
    return this.httpClient.post<AIFoodSuggestData>('/ai-food-suggest', filter);
  }

  retrySuggestFoods(aiResponseId: string) {
    return this.httpClient
      .post<AIFoodSuggestData>(`/ai-food-suggest/retry/${aiResponseId}`, {})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error as AIFoodSuggestErrorResponse);
        }),
      );
  }
}

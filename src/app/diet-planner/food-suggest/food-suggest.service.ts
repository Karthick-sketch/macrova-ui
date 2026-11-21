import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FoodSuggestModel } from './model/food-suggest.model';
import { FilterDto } from './dto/filter.dto';

@Injectable({
  providedIn: 'root',
})
export class FoodSuggestService {
  constructor(private httpClient: HttpClient) {}

  suggestFoods(filter: FilterDto) {
    return this.httpClient.post<FoodSuggestModel[]>('/food-suggest', filter);
  }
}

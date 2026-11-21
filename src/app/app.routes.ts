import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DietPlanFormComponent } from './diet-planner/diet-plan-form/diet-plan-form.component';
import { DietPlansListComponent } from './diet-planner/diet-plans-list/diet-plans-list.component';
import { DietPlanComponent } from './diet-planner/diet-plan.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FoodSuggestComponent } from './diet-planner/food-suggest/food-suggest.component';
import { NoActiveDietPlanComponent } from './diet-planner/no-active-diet-plan/no-active-diet-plan.component';
import { DietPlanOverviewComponent } from './diet-planner/diet-plan-overview/diet-plan-overview.component';
import { DietPlanTrackOverviewComponent } from './diet-planner/diet-plan-track-overview/diet-plan-track-overview.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'progress',
    component: DietPlanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'meals',
    component: FoodSuggestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    component: DietPlansListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'history/:id',
    component: DietPlanOverviewComponent,
  },
  {
    path: 'history/track/:id',
    component: DietPlanTrackOverviewComponent,
  },
  {
    path: 'diet-plan-form',
    component: DietPlanFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'no-active-plan',
    component: NoActiveDietPlanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

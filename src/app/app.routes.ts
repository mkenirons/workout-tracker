import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogWorkoutComponent } from './pages/log-workout/log-workout.component';
import { HistoryComponent } from './pages/history/history.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { BodyStatsComponent } from './pages/body-stats/body-stats.component';
import { ProgressComponent } from './pages/progress/progress.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'log', component: LogWorkoutComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'exercises', component: ExercisesComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'body-stats', component: BodyStatsComponent },
  { path: '**', redirectTo: '' },
];

import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { BodyStatsService } from '../../services/body-stats.service';
import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private workoutService = inject(WorkoutService);
  private bodyStatsService = inject(BodyStatsService);
  private exerciseService = inject(ExerciseService);

  totalSessions = computed(() => this.workoutService.totalSessions());
  lastSession = computed(() => this.workoutService.lastSession());
  totalExercises = computed(() => this.exerciseService.exercises().length);

  latestStat = computed(() => this.bodyStatsService.latest());
  goal = computed(() => this.bodyStatsService.goal());
  goalIsSet = computed(() => this.goal().targetWeightKg > 0 && this.goal().startWeightKg > 0);
  weightProgressPct = computed(() => this.bodyStatsService.weightProgressPct());

  kgToTarget = computed(() => {
    const latest = this.latestStat();
    const goal = this.goal();
    if (!latest?.weightKg) return null;
    return Math.max(0, Math.round((latest.weightKg - goal.targetWeightKg) * 10) / 10);
  });
}

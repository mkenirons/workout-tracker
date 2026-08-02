import { Injectable, computed, inject } from '@angular/core';
import { WorkoutSession } from '../models/workout.model';
import { UserDataService } from './user-data.service';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private userData = inject(UserDataService);

  readonly sessions = computed(() => this.userData.data().sessions);

  sortedByDateDesc(): WorkoutSession[] {
    return [...this.sessions()].sort((a, b) => b.date.localeCompare(a.date));
  }

  byId(id: string): WorkoutSession | undefined {
    return this.sessions().find((s) => s.id === id);
  }

  add(session: Omit<WorkoutSession, 'id'>): void {
    const newSession: WorkoutSession = { ...session, id: crypto.randomUUID() };
    this.userData.persist({ sessions: [...this.sessions(), newSession] });
  }

  update(id: string, changes: Partial<Omit<WorkoutSession, 'id'>>): void {
    this.userData.persist({
      sessions: this.sessions().map((s) => (s.id === id ? { ...s, ...changes } : s)),
    });
  }

  remove(id: string): void {
    this.userData.persist({ sessions: this.sessions().filter((s) => s.id !== id) });
  }

  /** Heaviest single set ever logged for an exercise (personal record). */
  personalRecord(exerciseId: string): { weightKg: number; reps: number; date: string } | null {
    let best: { weightKg: number; reps: number; date: string } | null = null;
    for (const session of this.sessions()) {
      for (const entry of session.exercises) {
        if (entry.exerciseId !== exerciseId) continue;
        for (const set of entry.sets) {
          if (set.weightKg == null) continue;
          if (!best || set.weightKg > best.weightKg) {
            best = { weightKg: set.weightKg, reps: set.reps ?? 0, date: session.date };
          }
        }
      }
    }
    return best;
  }

  totalSessions(): number {
    return this.sessions().length;
  }

  lastSession(): WorkoutSession | null {
    const sorted = this.sortedByDateDesc();
    return sorted.length > 0 ? sorted[0] : null;
  }

  /**
   * Top-set weight (and its reps) logged for an exercise in each session that
   * included it, sorted oldest to newest. Powers the progress chart.
   */
  exerciseHistory(exerciseId: string): { date: string; weightKg: number; reps: number }[] {
    const points: { date: string; weightKg: number; reps: number }[] = [];
    for (const session of this.sessions()) {
      const entry = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (!entry) continue;
      let top: { weightKg: number; reps: number } | null = null;
      for (const set of entry.sets) {
        if (set.weightKg == null) continue;
        if (!top || set.weightKg > top.weightKg) {
          top = { weightKg: set.weightKg, reps: set.reps ?? 0 };
        }
      }
      if (top) points.push({ date: session.date, ...top });
    }
    return points.sort((a, b) => a.date.localeCompare(b.date));
  }
}

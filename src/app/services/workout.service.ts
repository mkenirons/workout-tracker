import { Injectable, effect, signal } from '@angular/core';
import { WorkoutSession } from '../models/workout.model';
import { loadFromStorage, saveToStorage } from './storage.util';

const STORAGE_KEY = 'workout-tracker.sessions';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private readonly _sessions = signal<WorkoutSession[]>(
    loadFromStorage(STORAGE_KEY, [])
  );
  readonly sessions = this._sessions.asReadonly();

  constructor() {
    effect(() => saveToStorage(STORAGE_KEY, this._sessions()));
  }

  sortedByDateDesc(): WorkoutSession[] {
    return [...this._sessions()].sort((a, b) => b.date.localeCompare(a.date));
  }

  byId(id: string): WorkoutSession | undefined {
    return this._sessions().find((s) => s.id === id);
  }

  add(session: Omit<WorkoutSession, 'id'>): void {
    const newSession: WorkoutSession = { ...session, id: crypto.randomUUID() };
    this._sessions.update((list) => [...list, newSession]);
  }

  remove(id: string): void {
    this._sessions.update((list) => list.filter((s) => s.id !== id));
  }

  /** Heaviest single set ever logged for an exercise (personal record). */
  personalRecord(exerciseId: string): { weightKg: number; reps: number; date: string } | null {
    let best: { weightKg: number; reps: number; date: string } | null = null;
    for (const session of this._sessions()) {
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
    return this._sessions().length;
  }

  lastSession(): WorkoutSession | null {
    const sorted = this.sortedByDateDesc();
    return sorted.length > 0 ? sorted[0] : null;
  }
}

import { Injectable, effect, signal } from '@angular/core';
import { BodyGoal, BodyStatEntry } from '../models/body-stat.model';
import { BODY_GOAL_SEED, BODY_STAT_SEED } from '../data/body-stats.seed';
import { loadFromStorage, saveToStorage } from './storage.util';

const ENTRIES_KEY = 'workout-tracker.body-stats';
const GOAL_KEY = 'workout-tracker.body-goal';

@Injectable({ providedIn: 'root' })
export class BodyStatsService {
  private readonly _entries = signal<BodyStatEntry[]>(
    loadFromStorage(ENTRIES_KEY, BODY_STAT_SEED)
  );
  private readonly _goal = signal<BodyGoal>(loadFromStorage(GOAL_KEY, BODY_GOAL_SEED));

  readonly entries = this._entries.asReadonly();
  readonly goal = this._goal.asReadonly();

  constructor() {
    effect(() => saveToStorage(ENTRIES_KEY, this._entries()));
    effect(() => saveToStorage(GOAL_KEY, this._goal()));
  }

  sortedByDateAsc(): BodyStatEntry[] {
    return [...this._entries()].sort((a, b) => a.date.localeCompare(b.date));
  }

  latest(): BodyStatEntry | null {
    const sorted = this.sortedByDateAsc();
    return sorted.length > 0 ? sorted[sorted.length - 1] : null;
  }

  /** 0-100 progress toward target weight, based on the goal's start weight. */
  weightProgressPct(): number {
    const goal = this._goal();
    const latest = this.latest();
    if (!latest?.weightKg) return 0;
    const total = goal.startWeightKg - goal.targetWeightKg;
    if (total <= 0) return 0;
    const done = goal.startWeightKg - latest.weightKg;
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  }

  add(entry: Omit<BodyStatEntry, 'id'>): void {
    const newEntry: BodyStatEntry = { ...entry, id: crypto.randomUUID() };
    this._entries.update((list) => [...list, newEntry]);
  }

  remove(id: string): void {
    this._entries.update((list) => list.filter((e) => e.id !== id));
  }

  updateGoal(changes: Partial<BodyGoal>): void {
    this._goal.update((g) => ({ ...g, ...changes }));
  }
}

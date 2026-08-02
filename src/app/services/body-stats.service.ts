import { Injectable, computed, inject } from '@angular/core';
import { BodyGoal, BodyStatEntry } from '../models/body-stat.model';
import { UserDataService } from './user-data.service';

@Injectable({ providedIn: 'root' })
export class BodyStatsService {
  private userData = inject(UserDataService);

  readonly entries = computed(() => this.userData.data().bodyStats);
  readonly goal = computed(() => this.userData.data().bodyGoal);

  sortedByDateAsc(): BodyStatEntry[] {
    return [...this.entries()].sort((a, b) => a.date.localeCompare(b.date));
  }

  latest(): BodyStatEntry | null {
    const sorted = this.sortedByDateAsc();
    return sorted.length > 0 ? sorted[sorted.length - 1] : null;
  }

  /** 0-100 progress toward target weight, based on the goal's start weight. */
  weightProgressPct(): number {
    const goal = this.goal();
    const latest = this.latest();
    if (!latest?.weightKg) return 0;
    const total = goal.startWeightKg - goal.targetWeightKg;
    if (total <= 0) return 0;
    const done = goal.startWeightKg - latest.weightKg;
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  }

  add(entry: Omit<BodyStatEntry, 'id'>): void {
    const newEntry: BodyStatEntry = { ...entry, id: crypto.randomUUID() };
    this.userData.persist({ bodyStats: [...this.entries(), newEntry] });
  }

  remove(id: string): void {
    this.userData.persist({ bodyStats: this.entries().filter((e) => e.id !== id) });
  }

  updateGoal(changes: Partial<BodyGoal>): void {
    this.userData.persist({ bodyGoal: { ...this.goal(), ...changes } });
  }
}

import { Injectable, effect, signal } from '@angular/core';
import { Exercise, MuscleGroup } from '../models/exercise.model';
import { EXERCISE_SEED } from '../data/exercises.seed';
import { loadFromStorage, saveToStorage } from './storage.util';

const STORAGE_KEY = 'workout-tracker.exercises';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private readonly _exercises = signal<Exercise[]>(
    loadFromStorage(STORAGE_KEY, EXERCISE_SEED)
  );
  readonly exercises = this._exercises.asReadonly();

  constructor() {
    effect(() => saveToStorage(STORAGE_KEY, this._exercises()));
  }

  byId(id: string): Exercise | undefined {
    return this._exercises().find((e) => e.id === id);
  }

  groupedByMuscle(): { group: MuscleGroup; exercises: Exercise[] }[] {
    const groups: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs'];
    return groups
      .map((group) => ({
        group,
        exercises: this._exercises().filter((e) => e.muscleGroup === group),
      }))
      .filter((g) => g.exercises.length > 0);
  }

  add(exercise: Omit<Exercise, 'id'>): void {
    const newExercise: Exercise = { ...exercise, id: crypto.randomUUID() };
    this._exercises.update((list) => [...list, newExercise]);
  }

  update(id: string, changes: Partial<Omit<Exercise, 'id'>>): void {
    this._exercises.update((list) =>
      list.map((e) => (e.id === id ? { ...e, ...changes } : e))
    );
  }

  remove(id: string): void {
    this._exercises.update((list) => list.filter((e) => e.id !== id));
  }
}

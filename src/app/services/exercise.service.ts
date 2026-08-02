import { Injectable, computed, inject } from '@angular/core';
import { Exercise, MuscleGroup } from '../models/exercise.model';
import { UserDataService } from './user-data.service';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private userData = inject(UserDataService);

  readonly exercises = computed(() => this.userData.data().exercises);

  byId(id: string): Exercise | undefined {
    return this.exercises().find((e) => e.id === id);
  }

  groupedByMuscle(): { group: MuscleGroup; exercises: Exercise[] }[] {
    const groups: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs'];
    return groups
      .map((group) => ({
        group,
        exercises: this.exercises().filter((e) => e.muscleGroup === group),
      }))
      .filter((g) => g.exercises.length > 0);
  }

  add(exercise: Omit<Exercise, 'id'>): void {
    const newExercise: Exercise = { ...exercise, id: crypto.randomUUID() };
    this.userData.persist({ exercises: [...this.exercises(), newExercise] });
  }

  update(id: string, changes: Partial<Omit<Exercise, 'id'>>): void {
    this.userData.persist({
      exercises: this.exercises().map((e) => (e.id === id ? { ...e, ...changes } : e)),
    });
  }

  remove(id: string): void {
    this.userData.persist({ exercises: this.exercises().filter((e) => e.id !== id) });
  }
}

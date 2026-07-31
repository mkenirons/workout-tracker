import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutExerciseEntry, WorkoutSetEntry } from '../../models/workout.model';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-log-workout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './log-workout.component.html',
  styleUrl: './log-workout.component.scss',
})
export class LogWorkoutComponent {
  private exerciseService = inject(ExerciseService);
  private workoutService = inject(WorkoutService);
  private router = inject(Router);

  exercises = this.exerciseService.exercises;
  date = signal(todayIso());
  notes = signal('');
  entries = signal<WorkoutExerciseEntry[]>([]);
  selectedExerciseId = signal<string>('');

  addExercise() {
    const id = this.selectedExerciseId();
    if (!id) return;
    if (this.entries().some((e) => e.exerciseId === id)) return;
    const exercise = this.exerciseService.byId(id);
    if (!exercise) return;

    const sets: WorkoutSetEntry[] = Array.from({ length: exercise.targetSets || 3 }, (_, i) => ({
      setNumber: i + 1,
      weightKg: null,
      reps: null,
    }));

    this.entries.update((list) => [
      ...list,
      { exerciseId: exercise.id, exerciseName: exercise.name, sets },
    ]);
    this.selectedExerciseId.set('');
  }

  removeExercise(exerciseId: string) {
    this.entries.update((list) => list.filter((e) => e.exerciseId !== exerciseId));
  }

  addSet(exerciseId: string) {
    this.entries.update((list) =>
      list.map((e) =>
        e.exerciseId === exerciseId
          ? { ...e, sets: [...e.sets, { setNumber: e.sets.length + 1, weightKg: null, reps: null }] }
          : e
      )
    );
  }

  removeSet(exerciseId: string, setNumber: number) {
    this.entries.update((list) =>
      list.map((e) =>
        e.exerciseId === exerciseId
          ? {
              ...e,
              sets: e.sets
                .filter((s) => s.setNumber !== setNumber)
                .map((s, i) => ({ ...s, setNumber: i + 1 })),
            }
          : e
      )
    );
  }

  updateSet(exerciseId: string, setNumber: number, field: 'weightKg' | 'reps', value: string) {
    const parsed = value === '' ? null : Number(value);
    this.entries.update((list) =>
      list.map((e) =>
        e.exerciseId === exerciseId
          ? {
              ...e,
              sets: e.sets.map((s) => (s.setNumber === setNumber ? { ...s, [field]: parsed } : s)),
            }
          : e
      )
    );
  }

  canSave(): boolean {
    return this.entries().length > 0 && !!this.date();
  }

  save() {
    if (!this.canSave()) return;
    this.workoutService.add({
      date: this.date(),
      exercises: this.entries(),
      notes: this.notes() || undefined,
    });
    this.router.navigate(['/history']);
  }
}

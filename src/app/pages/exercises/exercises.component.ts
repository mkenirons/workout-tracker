import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from '../../services/exercise.service';
import { WorkoutService } from '../../services/workout.service';
import { Exercise, MuscleGroup } from '../../models/exercise.model';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent {
  exerciseService = inject(ExerciseService);
  workoutService = inject(WorkoutService);

  muscleGroups: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs'];

  showForm = signal(false);
  editingId = signal<string | null>(null);
  draft = signal<Omit<Exercise, 'id'>>({
    name: '',
    muscleGroup: 'Chest',
    targetSets: 3,
    targetReps: '8-10',
  });

  groups = () => this.exerciseService.groupedByMuscle();

  pr(exerciseId: string) {
    return this.workoutService.personalRecord(exerciseId);
  }

  startAdd() {
    this.editingId.set(null);
    this.draft.set({ name: '', muscleGroup: 'Chest', targetSets: 3, targetReps: '8-10' });
    this.showForm.set(true);
  }

  startEdit(exercise: Exercise) {
    this.editingId.set(exercise.id);
    this.draft.set({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      targetSets: exercise.targetSets,
      targetReps: exercise.targetReps,
    });
    this.showForm.set(true);
  }

  cancel() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  setDraftName(value: string) {
    this.draft.update((d) => ({ ...d, name: value }));
  }

  setDraftMuscleGroup(value: MuscleGroup) {
    this.draft.update((d) => ({ ...d, muscleGroup: value }));
  }

  setDraftSets(value: string) {
    this.draft.update((d) => ({ ...d, targetSets: Number(value) }));
  }

  setDraftReps(value: string) {
    this.draft.update((d) => ({ ...d, targetReps: value }));
  }

  save() {
    const value = this.draft();
    if (!value.name.trim()) return;
    const id = this.editingId();
    if (id) {
      this.exerciseService.update(id, value);
    } else {
      this.exerciseService.add(value);
    }
    this.cancel();
  }

  remove(id: string) {
    if (confirm('Remove this exercise from your library?')) {
      this.exerciseService.remove(id);
    }
  }
}

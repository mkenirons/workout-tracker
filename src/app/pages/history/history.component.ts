import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { ExerciseService } from '../../services/exercise.service';
import { generateWorkoutName } from '../../services/workout-name.util';
import { WorkoutSession } from '../../models/workout.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  private workoutService = inject(WorkoutService);
  private exerciseService = inject(ExerciseService);

  sessions = () => this.workoutService.sortedByDateDesc();

  displayName(session: WorkoutSession): string {
    if (session.name) return session.name;
    const groups = session.exercises
      .map((e) => this.exerciseService.byId(e.exerciseId)?.muscleGroup)
      .filter((g): g is NonNullable<typeof g> => !!g);
    return generateWorkoutName(groups);
  }
  expandedId = signal<string | null>(null);
  renamingId = signal<string | null>(null);
  nameDraft = signal('');

  toggle(id: string) {
    if (this.renamingId() === id) return;
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  remove(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Delete this workout session?')) {
      this.workoutService.remove(id);
    }
  }

  startRename(id: string, currentName: string, event: Event) {
    event.stopPropagation();
    this.renamingId.set(id);
    this.nameDraft.set(currentName);
  }

  cancelRename(event: Event) {
    event.stopPropagation();
    this.renamingId.set(null);
  }

  saveRename(id: string, event: Event) {
    event.stopPropagation();
    const name = this.nameDraft().trim();
    if (name) {
      this.workoutService.update(id, { name });
    }
    this.renamingId.set(null);
  }
}

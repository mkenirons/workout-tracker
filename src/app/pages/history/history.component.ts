import { Component, inject, signal } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  private workoutService = inject(WorkoutService);

  sessions = () => this.workoutService.sortedByDateDesc();
  expandedId = signal<string | null>(null);

  toggle(id: string) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  remove(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Delete this workout session?')) {
      this.workoutService.remove(id);
    }
  }
}

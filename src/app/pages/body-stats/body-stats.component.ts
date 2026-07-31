import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BodyStatsService } from '../../services/body-stats.service';
import { BodyStatEntry } from '../../models/body-stat.model';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-body-stats',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './body-stats.component.html',
  styleUrl: './body-stats.component.scss',
})
export class BodyStatsComponent {
  bodyStatsService = inject(BodyStatsService);

  goal = this.bodyStatsService.goal;
  entriesDesc = () => [...this.bodyStatsService.sortedByDateAsc()].reverse();
  progressPct = () => this.bodyStatsService.weightProgressPct();

  showForm = signal(false);
  draft = signal<Omit<BodyStatEntry, 'id'>>({
    date: todayIso(),
    weightKg: null,
    bodyFatPct: null,
    steps: null,
    proteinG: null,
    calories: null,
    notes: '',
  });

  startAdd() {
    this.draft.set({
      date: todayIso(),
      weightKg: null,
      bodyFatPct: null,
      steps: null,
      proteinG: null,
      calories: null,
      notes: '',
    });
    this.showForm.set(true);
  }

  cancel() {
    this.showForm.set(false);
  }

  updateField<K extends keyof Omit<BodyStatEntry, 'id'>>(field: K, raw: string) {
    const isNumeric = field !== 'date' && field !== 'notes';
    const value = isNumeric ? (raw === '' ? null : Number(raw)) : raw;
    this.draft.update((d) => ({ ...d, [field]: value }));
  }

  save() {
    const value = this.draft();
    if (!value.date) return;
    this.bodyStatsService.add(value);
    this.showForm.set(false);
  }

  remove(id: string) {
    if (confirm('Delete this entry?')) {
      this.bodyStatsService.remove(id);
    }
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from '../../services/exercise.service';
import { WorkoutService } from '../../services/workout.service';
import { niceTicks } from '../../services/chart.util';

const CHART_W = 640;
const CHART_H = 260;
const PAD_LEFT = 44;
const PAD_RIGHT = 16;
const PAD_TOP = 20;
const PAD_BOTTOM = 34;

interface ChartPoint {
  date: string;
  weightKg: number;
  reps: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {
  private exerciseService = inject(ExerciseService);
  private workoutService = inject(WorkoutService);

  chartW = CHART_W;
  chartH = CHART_H;
  innerLeft = PAD_LEFT;
  innerRight = CHART_W - PAD_RIGHT;
  innerTop = PAD_TOP;
  innerBottom = CHART_H - PAD_BOTTOM;

  exercises = computed(() =>
    [...this.exerciseService.exercises()].sort((a, b) => a.name.localeCompare(b.name))
  );

  exercisesWithHistory = computed(() =>
    new Set(
      this.exercises()
        .filter((ex) => this.workoutService.exerciseHistory(ex.id).length > 0)
        .map((ex) => ex.id)
    )
  );

  selectedId = signal<string>('');

  constructor() {
    const firstWithHistory = this.exercises().find((ex) =>
      this.workoutService.exerciseHistory(ex.id).length > 0
    );
    this.selectedId.set(firstWithHistory?.id ?? this.exercises()[0]?.id ?? '');
  }

  selectedExercise = computed(() => this.exerciseService.byId(this.selectedId()));

  rawHistory = computed(() => this.workoutService.exerciseHistory(this.selectedId()));

  yDomain = computed(() => {
    const values = this.rawHistory().map((p) => p.weightKg);
    if (values.length === 0) return { min: 0, max: 10 };
    return { min: Math.min(...values), max: Math.max(...values) };
  });

  yTicks = computed(() => {
    const { min, max } = this.yDomain();
    return niceTicks(min, max, 4);
  });

  points = computed<ChartPoint[]>(() => {
    const history = this.rawHistory();
    if (history.length === 0) return [];

    const ticks = this.yTicks();
    const yMin = ticks[0];
    const yMax = ticks[ticks.length - 1];
    const yRange = yMax - yMin || 1;

    const n = history.length;
    return history.map((p, i) => {
      const x = n === 1 ? (this.innerLeft + this.innerRight) / 2 : this.innerLeft + (i / (n - 1)) * (this.innerRight - this.innerLeft);
      const y = this.innerBottom - ((p.weightKg - yMin) / yRange) * (this.innerBottom - this.innerTop);
      return { ...p, x, y };
    });
  });

  linePath = computed(() => {
    const pts = this.points();
    if (pts.length < 2) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  });

  yFor(value: number): number {
    const ticks = this.yTicks();
    const yMin = ticks[0];
    const yMax = ticks[ticks.length - 1];
    const yRange = yMax - yMin || 1;
    return this.innerBottom - ((value - yMin) / yRange) * (this.innerBottom - this.innerTop);
  }

  hoverIndex = signal<number | null>(null);

  onPointerMove(event: PointerEvent) {
    const pts = this.points();
    if (pts.length === 0) return;
    const svgEl = event.currentTarget as SVGSVGElement;
    const rect = svgEl.getBoundingClientRect();
    const scaleX = this.chartW / rect.width;
    const localX = (event.clientX - rect.left) * scaleX;

    let nearest = 0;
    let nearestDist = Infinity;
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - localX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    this.hoverIndex.set(nearest);
  }

  onPointerLeave() {
    this.hoverIndex.set(null);
  }

  hoveredPoint = computed(() => {
    const idx = this.hoverIndex();
    return idx === null ? null : this.points()[idx];
  });

  tooltipFlipped = computed(() => {
    const p = this.hoveredPoint();
    return !!p && p.x > this.chartW - 150;
  });

  tableRowsDesc = computed(() => [...this.rawHistory()].reverse());

  onSelectExercise(id: string) {
    this.selectedId.set(id);
    this.hoverIndex.set(null);
  }
}

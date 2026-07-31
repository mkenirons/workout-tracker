export interface WorkoutSetEntry {
  setNumber: number;
  weightKg: number | null;
  reps: number | null;
}

export interface WorkoutExerciseEntry {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSetEntry[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  exercises: WorkoutExerciseEntry[];
  notes?: string;
}

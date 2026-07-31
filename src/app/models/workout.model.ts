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
  name: string;
  exercises: WorkoutExerciseEntry[];
  notes?: string;
}

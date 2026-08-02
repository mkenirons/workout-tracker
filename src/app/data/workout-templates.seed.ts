import { MuscleGroup } from '../models/exercise.model';

export interface WorkoutTemplate {
  id: string;
  label: string;
  muscleGroups: MuscleGroup[];
}

// Matches the user's regular 3-day split.
export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  { id: 'bench-triceps', label: 'Bench & Triceps', muscleGroups: ['Chest', 'Triceps'] },
  { id: 'back-biceps', label: 'Back & Biceps', muscleGroups: ['Back', 'Biceps'] },
  { id: 'shoulders-legs', label: 'Shoulders & Legs', muscleGroups: ['Shoulders', 'Legs'] },
];

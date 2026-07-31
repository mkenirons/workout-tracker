import { MuscleGroup } from '../models/exercise.model';

export function generateWorkoutName(muscleGroups: MuscleGroup[]): string {
  const unique = [...new Set(muscleGroups)];
  if (unique.length === 0) return 'Workout';
  if (unique.length === 1) return `${unique[0]} Day`;
  if (unique.length === 2) return `${unique[0]} & ${unique[1]} Day`;
  return 'Full Body Day';
}

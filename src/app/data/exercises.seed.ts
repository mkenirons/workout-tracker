import { Exercise } from '../models/exercise.model';

// Seeded from the user's exercise-tracking spreadsheet.
// Note: some rep ranges (e.g. "8-10") had been auto-converted to dates
// by Google Sheets (e.g. "10-Aug"); they are corrected back here.
export const EXERCISE_SEED: Exercise[] = [
  { id: 'flat-db-bench-warmup', name: 'Flat DB Bench (Warm-up)', muscleGroup: 'Chest', targetSets: 1, targetReps: '10' },
  { id: 'flat-db-bench-main', name: 'Flat DB Bench (Main)', muscleGroup: 'Chest', targetSets: 3, targetReps: '8-10' },
  { id: 'incline-db-bench', name: 'Incline DB Bench', muscleGroup: 'Chest', targetSets: 3, targetReps: '8-10' },
  { id: 'db-bench-flys', name: 'DB Bench Flys', muscleGroup: 'Chest', targetSets: 3, targetReps: '8-12' },
  { id: 'lying-db-extensions', name: 'Lying DB Extensions', muscleGroup: 'Triceps', targetSets: 3, targetReps: '8-12' },
  { id: 'db-kickbacks', name: 'DB Kickbacks', muscleGroup: 'Triceps', targetSets: 3, targetReps: '8-12' },
  { id: 'one-arm-db-rows', name: 'One-Arm DB Rows', muscleGroup: 'Back', targetSets: 3, targetReps: '8-10' },
  { id: 'db-reverse-flys', name: 'DB Reverse Flys', muscleGroup: 'Back', targetSets: 3, targetReps: '8-12' },
  { id: 'renegade-rows', name: 'Renegade Rows', muscleGroup: 'Back', targetSets: 3, targetReps: '8-10' },
  { id: 'hammer-curls', name: 'Hammer Curls', muscleGroup: 'Biceps', targetSets: 3, targetReps: '8-12' },
  { id: 'incline-db-curls', name: 'Incline DB Curls', muscleGroup: 'Biceps', targetSets: 3, targetReps: '8-12' },
  { id: 'db-wrist-curls', name: 'DB Wrist Curls', muscleGroup: 'Biceps', targetSets: 3, targetReps: '8-15' },
  { id: 'db-shoulder-press', name: 'DB Shoulder Press', muscleGroup: 'Shoulders', targetSets: 3, targetReps: '6-8' },
  { id: 'db-shoulder-shrugs', name: 'DB Shoulder Shrugs', muscleGroup: 'Shoulders', targetSets: 3, targetReps: '8-12' },
  { id: 'db-lateral-raises', name: 'DB Lateral Raises', muscleGroup: 'Shoulders', targetSets: 3, targetReps: '8-12' },
  { id: 'db-leg-extension', name: 'DB Leg Extension', muscleGroup: 'Legs', targetSets: 3, targetReps: '8-12' },
  { id: 'single-leg-step-up', name: 'Single Leg Step Up', muscleGroup: 'Legs', targetSets: 3, targetReps: '8' },
  { id: 'glute-bridge', name: 'Glute Bridge', muscleGroup: 'Legs', targetSets: 3, targetReps: '8' },
  { id: 'wall-sit', name: 'Wall Sit', muscleGroup: 'Legs', targetSets: 3, targetReps: '30s+' },
];

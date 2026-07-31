import { BodyGoal, BodyStatEntry } from '../models/body-stat.model';

// Seeded from the "Birthday Goal Tracker" section of the user's spreadsheet.
export const BODY_GOAL_SEED: BodyGoal = {
  heightCm: 198,
  startWeightKg: 103.5,
  targetWeightKg: 97,
  targetBodyFatLowPct: 22,
  targetBodyFatHighPct: 23,
  label: 'Birthday Goal',
};

export const BODY_STAT_SEED: BodyStatEntry[] = [
  { id: 'seed-start', date: '2026-03-23', weightKg: 103.5, bodyFatPct: 27.5, notes: 'Starting point' },
  { id: 'seed-week1', date: '2026-03-30', weightKg: 102.5, bodyFatPct: null, notes: 'Week 1 check-in' },
  { id: 'seed-week7', date: '2026-05-11', weightKg: 100.9, bodyFatPct: 26.6, notes: 'Week 7 check-in' },
  { id: 'seed-week16', date: '2026-07-13', weightKg: 99.35, bodyFatPct: 26.1, notes: 'Week 16 check-in' },
];

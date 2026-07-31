import { BodyGoal, BodyStatEntry } from '../models/body-stat.model';

// No personal data is hardcoded here (this app is publicly hosted) —
// set your own goal and entries from the Body Stats page; they're saved
// only in your browser's localStorage, never in this source code.
export const BODY_GOAL_SEED: BodyGoal = {
  heightCm: 0,
  startWeightKg: 0,
  targetWeightKg: 0,
  targetBodyFatLowPct: 0,
  targetBodyFatHighPct: 0,
  label: 'My Goal',
};

export const BODY_STAT_SEED: BodyStatEntry[] = [];
